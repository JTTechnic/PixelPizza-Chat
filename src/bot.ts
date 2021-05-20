import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import {ClientEvent, CustomClient} from "./api";

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

dotenv.config();

const client = new CustomClient();

// Add client events
for(const file of fs.readdirSync(path.join(__dirname, "events")).filter(file => file.endsWith(".js"))){
	const event: ClientEvent = new (require(`./events/${file}`))(client);
	if(event.once){
		client.once(event.name, (...args) => event.run(...args));
		continue;
	}
	client.on(event.name, (...args) => event.run(...args));
}

client.login(process.env.BOT_TOKEN);