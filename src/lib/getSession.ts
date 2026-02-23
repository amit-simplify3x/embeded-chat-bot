import { scalekit } from "./scalekit";
import { cookies } from "next/headers";

export async function getSession() {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value
    if (!accessToken) {
        return null
    }

    try {
        const result = await scalekit.validateToken(accessToken) as { sub: string }
        const user = await scalekit.user.getUser(result?.sub)
        return user
    } catch (error) {
        if (error instanceof Error && error.message.includes("nbf")) {
            try {
                // Wait 1 second and retry to handle clock skew
                await new Promise(resolve => setTimeout(resolve, 1000));
                const result = await scalekit.validateToken(accessToken) as { sub: string };
                const user = await scalekit.user.getUser(result?.sub);
                return user;
            } catch (retryError) {
                console.log("Retry failed:", retryError);
                return null;
            }
        }
        console.log(error)
        return null
    }


}