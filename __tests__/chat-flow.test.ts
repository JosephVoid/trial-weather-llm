import { requestModel } from "@/src/modules/core/lib/services/model-request.service";

describe("Full Flow Test", () => {
  it("requestModel", async () => {
    const response = await requestModel({
      model: "gemini",
      query: "What is the weather in Addis Ababa right now?",
    });
    expect(response).toBeTruthy();
    expect(response).toHaveProperty("arguments");
    expect(response).toHaveProperty("tool");
  });
});
