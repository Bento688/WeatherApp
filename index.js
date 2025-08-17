import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { 
        content: "Waiting for data...",
        initial: true, 
    });
});

app.post("/fetchdata", async (req, res) => {
    const query = req.body.city;
    try {
        // console.log(process.env.BASE_URL + "/current.json" + "?key=" + process.env.API_KEY + "&q=" + query);
        const result = await axios.get(process.env.BASE_URL + "/current.json" + "?key=" + process.env.API_KEY + "&q=" + query);
        result.data.current.condition.icon = "https:" + result.data.current.condition.icon; 
        res.render("index.ejs", { 
            data: result.data,
            initial: false,
        });
    } catch (error) {
        res.redirect("/");
        res.status(404);
        console.log("Error: ", error.message);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`App running in port ${process.env.PORT}`);
});