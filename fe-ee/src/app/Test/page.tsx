'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Clipboard, Check, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

export default function AIInterface() {
	const [message, setMessage] = useState("");
	const [response, setResponse] = useState("");

	const [isLoading, setIsLoading] = useState(false)
	const [copied, setCopied] = useState(false)

	const handleSubmit = async () => {
		setIsLoading(true)
		setResponse("")
		const res = await fetch("/api/groq", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message }),
		});
		setIsLoading(false)
		const data = await res.json();
		setResponse(data.content);
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(response)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}


	return (
		<div className="container mx-auto p-4 max-w-5xl">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-100">

				<div className="flex flex-col">
					<h2 className="text-lg font-medium mb-2">Ask a Question</h2>
					<div className="flex-1 flex flex-col">
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Enter your message"
						/>
						<Button onClick={handleSubmit} disabled={!message.trim() || isLoading} className="bg-blue-600 mt-2 self-end gap-2">
							{isLoading ? (
								<>
									Processing <Loader2 className="h-4 w-4 animate-spin" />
								</>
							) : (
								<>
									Send <Send className="h-4 w-4" />
								</>
							)}
						</Button>
					</div>
				</div>

				<div className="flex flex-col">
					<div className="flex justify-between items-center mb-2">
						<h2 className="text-lg font-medium">Answer</h2>
						{response && (
							<Button
								size="sm"
								variant="ghost"
								onClick={copyToClipboard}
								className="h-8 px-2"
								title="Copy to clipboard"
							>
								{copied ? <Check className="h-4 w-4 text-green-500 mr-1" /> : <Clipboard className="h-4 w-4 mr-1" />}
								{copied ? "Copied" : "Copy"}
							</Button>
						)}
					</div>

					<Card className="flex-1 overflow-auto">
						<CardContent className="px-4 h-96">
							{isLoading ? (
								<div className="space-y-2 mt-4">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-[90%]" />
									<Skeleton className="h-4 w-[95%]" />
									<Skeleton className="h-4 w-[85%]" />
									<Skeleton className="h-4 w-[70%]" />
								</div>
							) : response && (
								<div className="prose dark:prose-invert max-w-none">
									<MarkdownRenderer content={response} />
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
