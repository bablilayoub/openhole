#!/usr/bin/env bash
# Commit without Co-authored-by trailers (bypasses IDE commit hooks).
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: ./scripts/clean-commit.sh \"commit message\""
  exit 1
fi

MSG="$1"
AUTHOR_NAME="${GIT_AUTHOR_NAME:-bablilayoub}"
AUTHOR_EMAIL="${GIT_AUTHOR_EMAIL:-ayoubbablil@gmail.com}"

git add -A
TREE=$(git write-tree)
PARENT=$(git rev-parse HEAD 2>/dev/null || true)

if [ -n "$PARENT" ]; then
  COMMIT=$(GIT_AUTHOR_NAME="$AUTHOR_NAME" GIT_AUTHOR_EMAIL="$AUTHOR_EMAIL" \
    GIT_COMMITTER_NAME="$AUTHOR_NAME" GIT_COMMITTER_EMAIL="$AUTHOR_EMAIL" \
    git commit-tree "$TREE" -p "$PARENT" -m "$MSG")
else
  COMMIT=$(GIT_AUTHOR_NAME="$AUTHOR_NAME" GIT_AUTHOR_EMAIL="$AUTHOR_EMAIL" \
    GIT_COMMITTER_NAME="$AUTHOR_NAME" GIT_COMMITTER_EMAIL="$AUTHOR_EMAIL" \
    git commit-tree "$TREE" -m "$MSG")
fi

git reset --hard "$COMMIT"
echo "Committed: $COMMIT"
git log -1 --format='Author: %an <%ae>%n%n%B'
