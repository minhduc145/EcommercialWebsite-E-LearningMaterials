"use client"

import { useState, useEffect, ReactHTMLElement, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Check, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getUsers } from "@/app/api/api-users"
import { UserModel } from "@/models/UserModel"
import { sendMessage } from "@/app/api/api-messages"
import MyToaster from "@/components/ui/toastify-template"
import MyEditor from "@/components/editor"
interface SendBody {
    isForEveryone: boolean | false;
    title: string;
    message: string;
    id: string[]
}
export default function MessageForm() {
    const [sendToEveryone, setSendToEveryone] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [selectedPeople, setSelectedPeople] = useState<UserModel[]>([])
    const [message, setMessage] = useState("")
    const [title, setTitle] = useState("")

    const handleSendToEveryoneChange = (checked: boolean) => {
        setSendToEveryone(checked)
        if (checked) {
            setSelectedIds([])
            setSelectedPeople([])
        }
    }

    const onSubmit = () => {
        const sendBody: SendBody = {
            isForEveryone: sendToEveryone,
            title: title,
            message: message,
            id: selectedIds
        }
        sendMessage(sendBody).then(() => {
            MyToaster("success")
            setSendToEveryone(false);
            setSelectedPeople([])
            setTitle('');
            setMessage('');
            setSelectedIds([]);
        }).catch(() => {
            MyToaster("error")
        })
    }

    return (
        <Card className="w-full mx-auto flex flex-col gap-2 ">
            <CardHeader>
                <CardTitle>Thông báo mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="send-to-everyone"
                        checked={sendToEveryone}
                        onCheckedChange={(checked) => {
                            handleSendToEveryoneChange(!!checked)
                        }}
                    />
                    <Label
                        htmlFor="send-to-everyone"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Gửi cho tất cả
                    </Label>
                </div>

                <div className="space-y-2">
                    {!sendToEveryone && (
                        <>
                            <Label htmlFor="recipients">Người nhận</Label>
                            <div className="flex flex-row flex-wrap gap-2">
                                {selectedPeople.map((person) => (
                                    <Badge key={person.id} variant="secondary" className="flex items-center gap-1">
                                        {person.lastName + " " + person.firstName}
                                    </Badge>
                                ))}
                            </div>
                            <PeopleSelectionDialog
                                onSelectionConfirmed={(ids, people) => {
                                    setSelectedIds(ids)
                                    setSelectedPeople(people)
                                }}
                                selectedIds={selectedIds}
                            />
                        </>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề</Label>
                    <Input id="title" placeholder="Tiêu đề..." value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Nội dung</Label>
                    <MyEditor value={message} handleChange={setMessage}/>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={(!sendToEveryone && selectedIds.length === 0) || !message || !title}
                    onClick={onSubmit}
                >
                    Gửi
                </Button>
            </CardFooter>
        </Card>
    )
}

interface PeopleSelectionDialogProps {
    onSelectionConfirmed: (selectedIds: string[], selectedPeople: UserModel[]) => void
    selectedIds?: string[]
}

export function PeopleSelectionDialog({ onSelectionConfirmed, selectedIds = [] }: PeopleSelectionDialogProps) {
    const [peopleData, setPeopleData] = useState<UserModel[]>()
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedPeopleIds, setSelectedPeopleIds] = useState<string[]>(selectedIds)
    const [filteredPeople, setFilteredPeople] = useState<UserModel[] | undefined>(peopleData)

    useEffect(() => {
        getUsers().then(res => {
            setPeopleData(res?.data)
        }).catch(() => { setPeopleData([]) })
    }, [])

    useEffect(() => {
        setSelectedPeopleIds(selectedIds)
    }, [selectedIds])



    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredPeople(peopleData)
            return
        }
        const query = searchQuery.toLowerCase()
        const filtered = peopleData?.filter(
            (person) =>
                person.firstName.toLowerCase().includes(query) ||
                person.lastName.toLowerCase().includes(query) ||
                person.email.toLowerCase().includes(query) ||
                person.phone && person.phone.toLowerCase().includes(query) ||
                person.id.toLowerCase().includes(query),
        )
        setFilteredPeople(filtered)
    }, [searchQuery, peopleData])

    const toggleSelection = (personId: string) => {
        setSelectedPeopleIds((prev) => {
            if (prev.includes(personId)) {
                return prev.filter((id) => id !== personId)
            } else {
                return [...prev, personId]
            }
        })
    }

    const handleConfirm = () => {
        const selectedPeopleObjects = peopleData?.filter((person) => selectedPeopleIds.includes(person.id))
        selectedPeopleObjects && onSelectionConfirmed(selectedPeopleIds, selectedPeopleObjects)
        setOpen(false)
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setSearchQuery("")
        }
        setOpen(newOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>Chọn người nhận</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{""}</DialogTitle>
                </DialogHeader>

                {/* Search input */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên, id, email, sđt"
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-7 w-7 p-0"
                            onClick={() => setSearchQuery("")}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear search</span>
                        </Button>
                    )}
                </div>

                {/* Results list */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Kết quả ({filteredPeople?.length ?? 0})</h4>
                    <ScrollArea className="h-[200px] rounded-md border">
                        {filteredPeople && filteredPeople?.length > 0 ? (
                            <ul className="p-1">
                                {filteredPeople?.map((person) => {
                                    const isSelected = selectedPeopleIds.includes(person.id)
                                    return (
                                        <li key={person.id}>
                                            <div
                                                className={`hover:cursor-pointer flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm ${isSelected ? "bg-primary/5 text-primary" : "hover:bg-muted"
                                                    }`}
                                                onClick={() => toggleSelection(person.id)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() => { }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="pointer-events-none"
                                                    />
                                                    <div>
                                                        <div className="font-medium">{person.lastName + " " + person.firstName}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {person.id} • {person.email} • {person.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                                {isSelected && <Check className="h-4 w-4 text-primary" />}
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : (
                            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                                Không có kq
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter className="flex items-center justify-between sm:justify-between">
                    <div className="text-sm text-muted-foreground">{selectedPeopleIds.length} đã chọn</div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Thoát
                        </Button>
                        <Button onClick={handleConfirm}>Xác nhận</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
