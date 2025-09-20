import chatAction from "@/src/modules/core/lib/actions/chat.action";

describe("Chat Server Action Test", () => {
  it("Works", async () => {
    const response = await chatAction(
      "What is the weather like in Paris now?",
      "gemini"
    );
    expect(response).toBeTruthy();
  });
});
