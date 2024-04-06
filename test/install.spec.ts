import { createExpress } from "../packages/express-cli/cli/cli";
import { prompt } from "../packages/config/cli.config"; // Make sure to import prompt directly from the module
import { preferences } from "../packages/config/cli.config";

jest.mock("packages/config/cli.config", () => ({
  prompt: jest.fn(), // Mock prompt function
  preferences: {}, // Mock preferences if needed
}));

describe("createExpress", () => {
  it("prompts the user for input and sets preferences", async () => {
    // Setup promptMock to return a mocked value
    (prompt as unknown as jest.Mock).mockResolvedValueOnce({
      database: "MongoDB",
      dependency: "pre installed",
      package: "npm",
      language: "JavaScript",
    });

    await createExpress("myapp");

    // Your test assertions here#expect(promptMock).toHaveBeenCalled();
    expect(preferences.database).toBe("MongoDB");
    expect(preferences.injection).toBe("pre installed");
    expect(preferences.packageManager).toBe("npm");
    expect(preferences.language).toBe("JavaScript");
  });
});
