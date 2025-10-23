interface GitHubFile {
  path: string;
  content: string;
  sha: string;
  type: string;
}

interface GitHubTreeItem {
  path: string;
  type: string;
  sha: string;
  url: string;
}

export class GitHubService {
  private baseUrl = 'https://api.github.com';

  private base64ToUtf8(base64: string): string {
    // Remove any newlines that GitHub may insert in base64 content
    const sanitized = base64.replace(/\n/g, '');
    const binaryString = atob(sanitized);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  }

  async fetchRepositoryFiles(
    owner: string,
    repo: string,
    branch: string,
    token: string
  ): Promise<GitHubFile[]> {
    const tree = await this.getRepositoryTree(owner, repo, branch, token);
    const editableFiles = tree.filter(item =>
      item.type === 'blob' &&
      this.isEditableFile(item.path)
    );

    const files: GitHubFile[] = [];
    for (const item of editableFiles) {
      try {
        const content = await this.getFileContent(owner, repo, item.path, branch, token);
        files.push({
          path: item.path,
          content: content.content,
          sha: content.sha,
          type: this.getFileType(item.path)
        });
      } catch (error) {
        console.error(`Failed to fetch ${item.path}:`, error);
      }
    }

    return files;
  }

  private async getRepositoryTree(
    owner: string,
    repo: string,
    branch: string,
    token: string
  ): Promise<GitHubTreeItem[]> {
    const response = await fetch(
      `${this.baseUrl}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tree;
  }

  private async getFileContent(
    owner: string,
    repo: string,
    path: string,
    branch: string,
    token: string
  ) {
    const response = await fetch(
      `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${path}`);
    }

    const data = await response.json();
    return {
      content: this.base64ToUtf8(data.content),
      sha: data.sha,
    };
  }

  private isEditableFile(path: string): boolean {
    const editableExtensions = ['.html', '.jsx', '.tsx', '.js', '.ts', '.vue', '.svelte'];
    return editableExtensions.some(ext => path.endsWith(ext));
  }

  private getFileType(path: string): string {
    const parts = path.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : 'unknown';
  }

  async commitChanges(
    owner: string,
    repo: string,
    branch: string,
    token: string,
    files: Array<{ path: string; content: string; sha: string }>,
    message: string
  ): Promise<{ sha: string }> {
    const latestCommit = await this.getLatestCommit(owner, repo, branch, token);
    const newTree = await this.createTree(owner, repo, token, latestCommit.tree_sha, files);
    const newCommit = await this.createCommit(
      owner,
      repo,
      token,
      message,
      newTree.sha,
      latestCommit.sha
    );
    await this.updateReference(owner, repo, branch, token, newCommit.sha);

    return { sha: newCommit.sha };
  }

  private async getLatestCommit(owner: string, repo: string, branch: string, token: string) {
    const response = await fetch(
      `${this.baseUrl}/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get latest commit');
    }

    const data = await response.json();
    const commitResponse = await fetch(data.object.url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const commitData = await commitResponse.json();
    return {
      sha: commitData.sha,
      tree_sha: commitData.tree.sha,
    };
  }

  private async createTree(
    owner: string,
    repo: string,
    token: string,
    baseTreeSha: string,
    files: Array<{ path: string; content: string; sha: string }>
  ) {
    const tree = files.map(file => ({
      path: file.path,
      mode: '100644',
      type: 'blob',
      content: file.content,
    }));

    const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/git/trees`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create tree');
    }

    return await response.json();
  }

  private async createCommit(
    owner: string,
    repo: string,
    token: string,
    message: string,
    treeSha: string,
    parentSha: string
  ) {
    const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/git/commits`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        tree: treeSha,
        parents: [parentSha],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create commit');
    }

    return await response.json();
  }

  private async updateReference(
    owner: string,
    repo: string,
    branch: string,
    token: string,
    commitSha: string
  ) {
    const response = await fetch(
      `${this.baseUrl}/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sha: commitSha,
          force: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update reference');
    }

    return await response.json();
  }

  parseRepoUrl(url: string): { owner: string; repo: string } | null {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/,
      /github\.com\/([^\/]+)\/([^\/]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace('.git', ''),
        };
      }
    }

    return null;
  }
}

export const githubService = new GitHubService();
