package cmd

import (
	"encoding/json"
	"fmt"
	ioutil "io"
	"net/http"
)

type PackageInfo struct {
	Version string `json:"version"`
}

func GetCurrentVersionFromNpm(packageName string) (string, error) {
	url := fmt.Sprintf("https://registry.npmjs.org/%s/latest", packageName)
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to fetch package info: %s", resp.Status)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var info PackageInfo
	if err := json.Unmarshal(body, &info); err != nil {
		return "", err
	}

	return info.Version, nil
}
