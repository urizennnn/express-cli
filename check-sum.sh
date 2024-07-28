#!/bin/bash

# Directory containing your CLI binaries
BINARY_DIR="./bin"

# Output file for checksums
CHECKSUM_FILE="your-cli-checksums.txt"

# Ensure the binary directory exists
if [ ! -d "$BINARY_DIR" ]; then
    echo "Error: Binary directory not found: $BINARY_DIR"
    exit 1
fi

# Change to the binary directory
cd "$BINARY_DIR" || exit 1

# Remove any existing checksum file
rm -f "$CHECKSUM_FILE"

# Generate checksums for all binaries
for file in your-cli-*; do
    if [ -f "$file" ]; then
        if command -v sha256sum > /dev/null 2>&1; then
            # Linux
            sha256sum "$file" >> "$CHECKSUM_FILE"
        elif command -v shasum > /dev/null 2>&1; then
            # macOS
            shasum -a 256 "$file" >> "$CHECKSUM_FILE"
        else
            echo "Error: No suitable checksum tool found (sha256sum or shasum)"
            exit 1
        fi
    fi
done

echo "Checksums have been saved to $CHECKSUM_FILE"

# Display the contents of the checksum file
cat "$CHECKSUM_FILE"
