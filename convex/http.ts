import { httpRouter } from "convex/server";
import { handleWebhook } from "./clerkWebhook";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: handleWebhook,
});

export default http;
