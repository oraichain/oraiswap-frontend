#!/bin/bash

# Function to remove single-line comments starting with //
remove_single_line_comments() {
    sed -i '' 's#//.*$##' "$1"
}

# Find and remove comments in all .scss files
find . -name '*.scss' | while read filename; do
    echo "Removing comments from $filename"
    remove_single_line_comments "$filename"
    remove_multi_line_comments "$filename"
done

echo "Comments removed from all .scss files."
