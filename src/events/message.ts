/* eslint-disable capitalized-comments */
import { Message } from "discord.js";
import {ClientEvent, CustomClient} from "../api";

module.exports = class MessageEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "message");
	}

	private readonly responses: {
		trigger: string | string[];
		reply: string | string[];
	}[] = [
		{
			trigger: "pixel",
			reply: "Pizza"
		},
		{
			trigger: "yes or no",
			reply: [
				"Yes",
				"No"
			]
		},
		{
			trigger: [
				"how are you",
				"are you doing good",
				"you good",
				"are you ok"
			],
			reply: [
				"I'm Fine... how are you?",
				"I'm Pretty good, you?",
				"I'm Fantastic, I don't care how you are..."
			]
		},
		{
			trigger: [
				"who are you",
				"what are you"
			],
			reply: [
				"I'm a pizza delivery bot!",
				"A bot that deliveres pizza"
			]
		},
		{
			trigger: [
				"hi",
				"hey",
				"hello"
			],
			reply: [
				"Hello!",
				"Hi!",
				"Hey!",
				"Hi there!"
			]
		},
		{
			trigger: [
				"bye",
				"goodbye",
				"cya",
				"see you later"
			],
			reply: [
				"See you later!",
				"Bye!",
				"Goodbye!"
			]
		},
		{
			trigger: [
				"no",
				"nope"
			],
			reply: [
				"Sad",
				"Why?"
			]
		},
		{
			trigger: "why",
			reply: [
				"I don't know",
				"I'm not going to tell you"
			]
		},
		{
			trigger: "know why",
			reply: [
				"No",
				"Not really",
				"I do, but I'm not going to tell you..."
			]
		},
		{
			trigger: [
				"hate you",
				"do not like you"
			],
			reply: [
				"Why?",
				"That's not nice..."
			]
		},
		{
			trigger: "china",
			reply: "China"
		},
		{
			trigger: [
				"lol",
				"lmao"
			],
			reply: [
				"Lol",
				"Lmao"
			]
		},
		{
			trigger: [
				"ok",
				"okay",
				"kk",
				"k"
			],
			reply: [
				"Not okay",
				"Okay",
				"Not ok",
				"ok"
			]
		},
		{
			trigger: "master of puppets i am pulling your strings",
			reply: "Twisting your mind and smashing your dreams"
		},
		{
			trigger: "i love you",
			reply: [
				"thank you",
				"i love me too",
				"glad to hear it"
			]
		}
	];

	private readonly unknownResponses: string | string[] = [
		"Could you say that again?",
		"I don't understand",
		"What does that mean?"
	];

	private readonly replacements: {
		search: string;
		replacement: string;
	}[] = [
		{
			search: "whats",
			replacement: "what is"
		},
		{
			search: "whos",
			replacement: "who is"
		},
		{
			search: "dont",
			replacement: "do not"
		},
		{
			search: " u ",
			replacement: "you"
		},
		{
			search: " u$",
			replacement: "you"
		},
		{
			search: " r ",
			replacement: "are"
		},
		{
			search: "im",
			replacement: "i am"
		},
		{
			search: "ofc",
			replacement: "of course"
		},
		{
			search: "youre",
			replacement: "you are"
		},
		{
			search: "pixel pizza0000",
			replacement: ""
		}
	];

	public async run(message: Message) {
		if(message.webhookID || message.author.bot || (message.channel.type !== "dm" && message.channel.id !== process.env.TALK_CHANNEL_ID) || !message.content) return;

		// replace unneeded characters and caps
		let messageText: string = message.content.toLowerCase().replace(/[^\w\s\d]/gi, "");

		// replace shorter versions of words and abbreviations
		for(const replacement of this.replacements){
			messageText = messageText.replace(new RegExp(replacement.search, "g"), replacement.replacement);
		}

		if(!messageText) return;

		const words = messageText.split(/ +/);

		const possibleResponses = this.responses.filter(response => {
			// filter for words in the filter
			const triggers = typeof(response.trigger) === "string" ? [response.trigger] : response.trigger;
			for(const trigger of triggers){
				for(const word of words){
					if(trigger.includes(word)){
						return true;
					}
				}
			}
			return false;
		}).filter(response => {
			// filter for some of the text in the filter or the other way around
			const triggers = typeof(response.trigger) === "string" ? [response.trigger] : response.trigger;
			for(const trigger of triggers){
				if(messageText.includes(trigger) || trigger.includes(messageText)){
					return true;
				}
			}
			return false;
		});
		const exactResponse = possibleResponses.find(response => {
			// find a response that exactly matches the trigger
			const triggers = typeof(response.trigger) === "string" ? [response.trigger] : response.trigger;
			return triggers.includes(messageText);
		});
		// TODO change possibleResponses[0] to the most likely
		const foundResponses = exactResponse ? exactResponse.reply : (possibleResponses[0]?.reply ?? this.unknownResponses);
		const foundResponsesArray = typeof(foundResponses) === "string" ? [foundResponses] : foundResponses;

		const chosenReply = foundResponsesArray[Math.floor(Math.random() * foundResponsesArray.length)];

		if(message.channel.type === "dm"){
			return await message.channel.send(chosenReply);
		}

		await this.client.webhook.send(chosenReply);
	}
};