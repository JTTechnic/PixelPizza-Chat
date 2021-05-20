import {ClientEvent, CustomClient} from "../api";

module.exports = class ReadyEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "ready");
	}

	public async run() {
		await this.client.user?.setActivity({type: "LISTENING", name: "your messages"});
		console.log(`${this.client.user?.username} is ready!`);
	}
};