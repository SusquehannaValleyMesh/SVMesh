#!/bin/sh
set -eu

repository="${SVMESH_CONTENT_REPOSITORY:-SusquehannaValleyMesh/SVMesh}"
branch="${SVMESH_CONTENT_BRANCH:-main}"
archive="/tmp/svmesh-content.tar.gz"
source_dir="/tmp/svmesh-content-source"

refresh_content() {
  rm -rf "$source_dir" "$archive"
  mkdir -p "$source_dir"

  if ! wget -q -O "$archive" "https://codeload.github.com/${repository}/tar.gz/refs/heads/${branch}"; then
    echo "Unable to download content from GitHub repository ${repository} (${branch}); keeping the last synced content." >&2
    return 1
  fi

  if ! tar -xzf "$archive" -C "$source_dir" --strip-components=1 || \
     [ ! -d "$source_dir/content/pages" ]; then
    echo "Downloaded repository does not contain content/pages; keeping the last synced content." >&2
    return 1
  fi

  mkdir -p "$source_dir/content/updates"

  if ! SVMESH_CONTENT_SOURCE="$source_dir/content" \
    SVMESH_CONTENT_TARGET="/usr/share/nginx/html/content" \
    node /usr/local/lib/svmesh/sync-content.mjs; then
    echo "Unable to sync downloaded content; keeping the last synced content." >&2
    return 1
  fi
}

refresh_content || true

(
  while :; do
    sleep 14400
    refresh_content || true
  done
) &

exec "$@"