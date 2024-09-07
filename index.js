import express from "express";
const app  = express();

import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
    headless:true,
    defaultViewport:null
});

const page = await browser.newPage();

app.get("/",(req,res)=>{
    return res.send("This app is made by Mohit - for more information contact 9667067062");
});

app.get("/order/track/",async (req,res)=>{
    try {
        await page.goto(`https://shipeasy.tech/app/public/tracking/${req.query.awb}`, { waitUntil: "domcontentloaded" });

        const data = await page.evaluate(() => {
            let ret = [];
            const tr = document.getElementsByTagName("tr");
            for(let i=0;i<tr.length;i++){
                const th = tr[i].children;
                let dt = [];
                for(let j=0;j<th.length;j++){
                    dt.push(th[j].innerHTML);
                }
                ret.push(dt);
            }
            return ret
        })
        if(data.length == 0){
            return res.status(404).send("Awb not found");
        }

        return res.send(data)
    } catch (e) {
        res.json({ error: true, message:e})
    }
})

app.use((req,res)=>{
    return res.status(404).send("Page not found")
})

app.listen(4000,()=>{
    console.log("Listing on port 4000")
})

export default app