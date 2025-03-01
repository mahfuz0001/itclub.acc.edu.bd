"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", total: 5 },
  { name: "Feb", total: 8 },
  { name: "Mar", total: 13 },
  { name: "Apr", total: 10 },
  { name: "May", total: 16 },
  { name: "Jun", total: 12 },
  { name: "Jul", total: 14 },
  { name: "Aug", total: 18 },
  { name: "Sep", total: 21 },
  { name: "Oct", total: 17 },
  { name: "Nov", total: 19 },
  { name: "Dec", total: 23 },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="hsl(142.1, 76.2%, 36.3%)" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

