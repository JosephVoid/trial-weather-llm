import {
  feedModel,
  requestModel,
} from "@/src/modules/core/lib/services/model-request.service";
import executeTool from "@/src/modules/core/lib/services/tool.service";

describe("Full Flow Test", () => {
  it("requestModel + executeTool + feedModel", async () => {
    const response = await requestModel({
      model: "gemini",
      query: "What is the weather in Addis Ababa right now?",
    });
    expect(response).toBeTruthy();
    expect(response).toHaveProperty("arguments");
    expect(response).toHaveProperty("tool");

    if (response) {
      const toolResponse = await executeTool(response);
      expect(toolResponse).toBeTruthy();
      expect(toolResponse?.success).toBeTruthy();
      expect(toolResponse).toHaveProperty("response");

      if (toolResponse) {
        const userResponse = await feedModel({
          model: "gemini",
          feed: toolResponse.response,
        });
        expect(userResponse?.response).toBeTruthy();
        expect(userResponse?.success).toBeTruthy();
        expect(userResponse).toHaveProperty("response");
      }
    }
  });
});
