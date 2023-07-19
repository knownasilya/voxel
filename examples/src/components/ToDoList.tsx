"use client"

import { useArray, useObserve } from "@/lib/provider";
import { useCallback, useState } from "react";
import * as Y from 'yjs';

type ToDoItem = {
    text: string
    done: boolean
}

export function ToDoInput(props: { onItem: (text: string) => void }) {
    const [text, setText] = useState('')
    const clickCallback = useCallback(() => {
        props.onItem(text)
        setText('')
    }, [props, text])

    const changeCallback = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }, [setText])

    return (
        <div className="flex flex-row space-x-2">
            <input
                type="text"
                value={text}
                onChange={changeCallback}
                className="flex-1 block rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset
                ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600
                sm:text-sm sm:leading-6"
            />
            <button
                onClick={clickCallback}
                className="block rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold
                text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Add Item</button>
        </div>
    )
}

type ToDoItemProps = {
    item: Y.Map<any>
}

export function ToDoItem({item}: ToDoItemProps) {
    useObserve(item)

    const clickCallback = useCallback(() => {
        item.set("done", !item.get("done"))
    }, [item])

    return (
        <div>
            <label className="flex flex-row space-x-2">
                <input type="checkbox" checked={item.get("done")} onChange={clickCallback} />
                <input value={item.get("text")} onChange={(e) => item.set("text", e.target.value)} />
            </label>
        </div>
    )
}

export function ToDoList() {
    const items = useArray<Y.Map<any>>('todolist')

    const pushItem = useCallback((text: string) => {
        let item = new Y.Map([
            ["text", text],
            ["done", false],
        ] as [string, any][])

        items?.push([item])
    }, [items])

    const clearCompleted = useCallback(() => {
        let indexOffset = 0
        items?.forEach((item, index) => {
            if (item.get("done")) {
                items.delete(index - indexOffset, 1)
                indexOffset += 1
            }
        })
    }, [items])

    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-bold">To-do List</h1>
            <div className="mx-5 space-y-3">
                {
                    items && items.map((item, index) => <ToDoItem key={index} item={item} />)
                }
            </div>
            <ToDoInput onItem={pushItem} />
            <button
                onClick={clearCompleted}
                className="block rounded-md bg-red-600 px-3.5 py-2.5 text-center text-sm
                font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >Clear Completed</button>
        </div>
    )
}
