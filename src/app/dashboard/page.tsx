import DashBoardClient from "@/component/DashBoardClient";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import React from 'react';

async function Dashboard() {
    const session = await getSession();
    if (!session) {
        redirect("/");
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-50">
            <DashBoardClient ownerid={session?.user?.id ?? ""} />
        </div>
    )
}

export default Dashboard;