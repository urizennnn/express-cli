#!/bin/bash

BASE_URL="https://github.com/urizennnn/express-cli/releases/download/v2.4.5"
CHECKSUM_URL="https://example.com/express-cli/express-cli-check-sum.txt"


OS="$(uname -s)"
ARCH="$(uname -m)"


case "$OS" in
    Linux*)     
        OS_SUFFIX="linux"
        TARGET_DIR="/usr/local/bin"
        SHA256SUM="sha256sum"
        ;;
    Darwin*)    
        OS_SUFFIX="macos"
        TARGET_DIR="/usr/local/bin"
        SHA256SUM="shasum -a 256"
        ;;
    CYGWIN*|MINGW*|MSYS_NT*) 
        OS_SUFFIX="windows.exe"
        TARGET_DIR="/c/Windows/System32"
        SHA256SUM="sha256sum"
        ;;
    *)          
        echo "Unsupported OS: $OS"
        exit 1
        ;;
esac


case "$ARCH" in
    x86_64|amd64) ARCH_SUFFIX="amd64" ;;
    arm64|aarch64) ARCH_SUFFIX="arm64" ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac


FILENAME="express-cli-${OS_SUFFIX}-${ARCH_SUFFIX}"
FULL_URL="${BASE_URL}/express-cli-${OS_SUFFIX}-${ARCH_SUFFIX}"
if [ "$OS_SUFFIX" == "windows.exe" ]; then
    TARGET_FILE="express-cli.exe"
else
    TARGET_FILE="express-cli"
fi


TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR" || exit 1


echo "Downloading $TARGET_FILE from $FULL_URL..."
if ! curl -fsSL "$FULL_URL" -o "$FILENAME"; then
    echo "Failed to download the binary. Please check your internet connection and try again."
    exit 1
fi


echo "Downloading checksums..."
if ! curl -fsSL "$CHECKSUM_URL" -o checksums.txt; then
    echo "Failed to download checksums. Please check your internet connection and try again."
    exit 1
fi


echo "Verifying checksum..."
EXPECTED_CHECKSUM=$(grep "$FILENAME" checksums.txt | awk '{print $1}')
ACTUAL_CHECKSUM=$($SHA256SUM "$FILENAME" | awk '{print $1}')

if [ "$EXPECTED_CHECKSUM" != "$ACTUAL_CHECKSUM" ]; then
    echo "Checksum verification failed. The downloaded file may be corrupted or tampered with."
    exit 1
fi

echo "Checksum verified successfully."


if [ "$OS_SUFFIX" != "windows.exe" ]; then
    chmod +x "$FILENAME"
fi


if [ "$OS_SUFFIX" == "windows.exe" ]; then
    mv "$FILENAME" "$TARGET_DIR/$TARGET_FILE"
else
    sudo mv "$FILENAME" "$TARGET_DIR/$TARGET_FILE"
fi


cd - || exit 1
rm -rf "$TEMP_DIR"

echo "express-cli has been installed successfully to $TARGET_DIR/$TARGET_FILE!"

