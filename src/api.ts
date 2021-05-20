import { Client, ClientOptions, WebhookClient } from "discord.js";

class CustomClient extends Client {
	public readonly webhook: WebhookClient;

	public constructor(options?: ClientOptions){
		super(options);

		const id = process.env.TALK_WEBHOOK_ID;
		const token = process.env.TALK_WEBHOOK_TOKEN;
		if(!id || !token) throw new Error("No webhook id or token entered");

		this.webhook = new WebhookClient(id, token);
	}
}

abstract class ClientEvent {
	public readonly client: CustomClient;
	public readonly name: string;
	public readonly once: boolean;

	public constructor(client: CustomClient, name: string, once?: boolean){
		this.client = client;
		this.name = name;
		this.once = once ?? false;
	}

	public abstract run(...args: any[]): void;
}

export {
	CustomClient,
	ClientEvent
};