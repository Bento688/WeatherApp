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
        content: "Input your favorite city! ☝️",
        initial: true, 
    });
});

app.post("/fetchdata", async (req, res) => {
    const query = req.body.city;
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    try {
        // console.log(process.env.BASE_URL + "/current.json" + "?key=" + process.env.API_KEY + "&q=" + query);
        const result = await axios.get(process.env.BASE_URL + "/forecast.json" + "?key=" + process.env.API_KEY + "&q=" + query + "&days=10");
        
        //Fixing icon URL
        result.data.current.condition.icon = "https:" + result.data.current.condition.icon;
        
        //Adding a new dayName property in the JSON
        result.data.forecast.forecastday.forEach(day => {
            let dateObj = new Date(day.date);
            day.dayName = weekdays[dateObj.getDay()];
        });

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