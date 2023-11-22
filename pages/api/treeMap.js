import db, { map } from '../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
    const session = await getSession({ req: req });
    if (!session) {
        return res.status(401).end(`Not authenticated`);
    }
    
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    
    switch (req.method) {
        case 'POST':
        let hexid08 = req.body.hexid08;
        
        console.log("params........."+hexid08);
        
        hexid08 = hexid08.toString();
        hexid08 = hexid08.split(",").join("','")
        
        let mapCsIndicator = [
            {
                "columns_in_table": "smtii0001",
                "catg_three": "Beauty",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0002",
                "catg_three": "Pets",
                "catg_two": "Animals and Pets",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0003",
                "catg_three": "Fine Art",
                "catg_two": "Art and Crafts",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0004",
                "catg_three": "Arts And Crafts",
                "catg_two": "Art and Crafts",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0005",
                "catg_three": "Automotive",
                "catg_two": "Automobile",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0006",
                "catg_three": "Auto Buying And Selling",
                "catg_two": "Automobile",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0007",
                "catg_three": "Mutual Funds",
                "catg_two": "Banking and Finance",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0008",
                "catg_three": "Business And Finance",
                "catg_two": "Banking and Finance",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0009",
                "catg_three": "Personal Finance",
                "catg_two": "Banking and Finance",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0010",
                "catg_three": "Personal Investing",
                "catg_two": "Banking and Finance",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0011",
                "catg_three": "Stocks And Bonds",
                "catg_two": "Banking and Finance",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0012",
                "catg_three": "Government Business",
                "catg_two": "Business and Official",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0013",
                "catg_three": "Web Conferencing",
                "catg_two": "Business and Official",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0014",
                "catg_three": "Law",
                "catg_two": "Business and Official",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0015",
                "catg_three": "Careers",
                "catg_two": "Business and Official",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0016",
                "catg_three": "Agriculture",
                "catg_two": "Business and Official",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0017",
                "catg_three": "Business",
                "catg_two": "Business and Official",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0018",
                "catg_three": "Style & Fashion",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0019",
                "catg_three": "Radio",
                "catg_two": "Communication and Social",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0020",
                "catg_three": "Computer Networking",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0021",
                "catg_three": "Computer Peripherals",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0022",
                "catg_three": "Computer Software And Applications",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0023",
                "catg_three": "Programming Languages",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0024",
                "catg_three": "Web Design And Html",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0025",
                "catg_three": "Shareware And Freeware",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0026",
                "catg_three": "Email",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0027",
                "catg_three": "Information And Network Security",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0028",
                "catg_three": "Home & Garden",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0029",
                "catg_three": "Education",
                "catg_two": "Education and Learning",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0030",
                "catg_three": "Language Learning",
                "catg_two": "Education and Learning",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0031",
                "catg_three": "College Education",
                "catg_two": "Education and Learning",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0032",
                "catg_three": "Books And Literature",
                "catg_two": "Education and Learning",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0033",
                "catg_three": "Special Education",
                "catg_two": "Education and Learning",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0034",
                "catg_three": "College Education",
                "catg_two": "Education and Learning",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0035",
                "catg_three": "Green Solutions",
                "catg_two": "Environment and Sustainability",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0036",
                "catg_three": "Game & Fish",
                "catg_two": "Environment and Sustainability",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0037",
                "catg_three": "Society",
                "catg_two": "Environment and Sustainability",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0038",
                "catg_three": "Weather",
                "catg_two": "Environment and Sustainability",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0039",
                "catg_three": "Family And Relationships",
                "catg_two": "Family planning, childcare and family",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0040",
                "catg_three": "Food & Drink",
                "catg_two": "Food and Beverages",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0041",
                "catg_three": "Local News",
                "catg_two": "General Knowedge and News",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0042",
                "catg_three": "News And Politics",
                "catg_two": "General Knowedge and News",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0043",
                "catg_three": "International News",
                "catg_two": "General Knowedge and News",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0044",
                "catg_three": "Running And Jogging",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0045",
                "catg_three": "Holistic Health",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0046",
                "catg_three": "Healthy Living",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0047",
                "catg_three": "Health & Fitness",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0048",
                "catg_three": "Hobbies & Interests",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0049",
                "catg_three": "Medical Health",
                "catg_two": "Medical",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0050",
                "catg_three": "Search",
                "catg_two": "Miscellaneous",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0051",
                "catg_three": "Smartphones",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0052",
                "catg_three": "Movies",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0053",
                "catg_three": "Television",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0054",
                "catg_three": "Arts & Entertainment",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0055",
                "catg_three": "Entertainment",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0056",
                "catg_three": "Photography",
                "catg_two": "Photography",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0057",
                "catg_three": "Desktop Video",
                "catg_two": "Photography",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0058",
                "catg_three": "Cameras And Camcorders",
                "catg_two": "Photography",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0059",
                "catg_three": "Internet Safety",
                "catg_two": "Science and Technology",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0060",
                "catg_three": "Internet",
                "catg_two": "Science and Technology",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0061",
                "catg_three": "Internet For Beginners",
                "catg_two": "Science and Technology",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0062",
                "catg_three": "Science",
                "catg_two": "Science and Technology",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0063",
                "catg_three": "Technology & Computing",
                "catg_two": "Science and Technology",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0064",
                "catg_three": "Shopping",
                "catg_two": "Shopping habits",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0065",
                "catg_three": "Music And Audio",
                "catg_two": "Sound and Music",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0066",
                "catg_three": "Football News",
                "catg_two": "Sports and Games",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0067",
                "catg_three": "Video Gaming",
                "catg_two": "Sports and Games",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0068",
                "catg_three": "Board Games And Puzzles",
                "catg_two": "Sports and Games",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0069",
                "catg_three": "Sports",
                "catg_two": "Sports and Games",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0070",
                "catg_three": "Video & Computer Games",
                "catg_two": "Sports and Games",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0071",
                "catg_three": "Cricket",
                "catg_two": "Sports and Games",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0072",
                "catg_three": "Card Games",
                "catg_two": "Sports and Games",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0073",
                "catg_three": "Asia Travel",
                "catg_two": "Travel and Tourism",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smtii0074",
                "catg_three": "Travel",
                "catg_two": "Travel and Tourism",
                "catg_one": "Browsed topics and interests"
            },
            {
                "columns_in_table": "smgbh0001",
                "catg_three": "Beauty Enthusiasts",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0002",
                "catg_three": "Jewelry Enthusiasts",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0003",
                "catg_three": "Auto Modification Enthusiasts",
                "catg_two": "Automobile",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0004",
                "catg_three": "Automobile Owners",
                "catg_two": "Automobile",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0005",
                "catg_three": "Finance Professionals",
                "catg_two": "Banking and Finance",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0006",
                "catg_three": "In-Market Insurance Buyers",
                "catg_two": "Banking and Finance",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0007",
                "catg_three": "In-Market Personal Loans",
                "catg_two": "Banking and Finance",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0008",
                "catg_three": "In-Market Legal Services",
                "catg_two": "Business and Official",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0009",
                "catg_three": "Job Seekers",
                "catg_two": "Business and Official",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0010",
                "catg_three": "Diy Enthusiasts",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0011",
                "catg_three": "Home Movers",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0012",
                "catg_three": "In-Market Furniture Buyer",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0013",
                "catg_three": "In-Market Property Buyers",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0014",
                "catg_three": "New Home Buyer",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0015",
                "catg_three": "College Students",
                "catg_two": "Education and Learning",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0016",
                "catg_three": "In-Market Academic Services",
                "catg_two": "Education and Learning",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0017",
                "catg_three": "In-Market Appliance Shoppers",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0018",
                "catg_three": "In-Market Electronics Buyer",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0019",
                "catg_three": "In-Market Wedding Planning",
                "catg_two": "Family planning, childcare and family",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0020",
                "catg_three": "New Parents",
                "catg_two": "Family planning, childcare and family",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0021",
                "catg_three": "Parents",
                "catg_two": "Family planning, childcare and family",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0022",
                "catg_three": "Parents Of School Children",
                "catg_two": "Family planning, childcare and family",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0023",
                "catg_three": "Working Parents",
                "catg_two": "Family planning, childcare and family",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0024",
                "catg_three": "Beer Enthusiasts",
                "catg_two": "Food and Beverages",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0025",
                "catg_three": "Foodies",
                "catg_two": "Food and Beverages",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0026",
                "catg_three": "Frequent Coffee Shop Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0027",
                "catg_three": "Frequent Fast Food Diners",
                "catg_two": "Food and Beverages",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0028",
                "catg_three": "Frequent Nightlife Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0029",
                "catg_three": "Frequent Pizza Restaurant Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0030",
                "catg_three": "Tourist Diners",
                "catg_two": "Food and Beverages",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0031",
                "catg_three": "Wine Enthusiasts",
                "catg_two": "Food and Beverages",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0032",
                "catg_three": "Frequent Supermarket Shoppers",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0033",
                "catg_three": "Frequent Gym Goers",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0034",
                "catg_three": "Health Enthusiasts",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0035",
                "catg_three": "Family Leisure Enthusiasts",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0036",
                "catg_three": "Theme Park Enthusiasts",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0037",
                "catg_three": "Budget Hotel Visitors",
                "catg_two": "Hotels",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0038",
                "catg_three": "Chain Hotels Travellers",
                "catg_two": "Hotels",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0039",
                "catg_three": "Resort Hotel Visitors",
                "catg_two": "Hotels",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0040",
                "catg_three": "Serviced Apartments Travellers",
                "catg_two": "Hotels",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0041",
                "catg_three": "Frequent Pharmacy Shoppers",
                "catg_two": "Medical",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0042",
                "catg_three": "Tech Enthusiasts",
                "catg_two": "Science and Technology",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0043",
                "catg_three": "Frequent Luxury Shopper",
                "catg_two": "Shopping habits",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0044",
                "catg_three": "Frequent Mall Shoppers",
                "catg_two": "Shopping habits",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0045",
                "catg_three": "Shopaholics",
                "catg_two": "Shopping habits",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0046",
                "catg_three": "Affluent Consumers",
                "catg_two": "Socio-economic standing",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0047",
                "catg_three": "Sports Enthusiasts",
                "catg_two": "Sports and Games",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0048",
                "catg_three": "3 Star Hotel Travellers",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0049",
                "catg_three": "Budget Travellers",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0050",
                "catg_three": "Business Class Travellers",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0051",
                "catg_three": "Business Travellers",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0052",
                "catg_three": "Business/First Class Lounge Visitors",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0053",
                "catg_three": "Commuters",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0054",
                "catg_three": "Family Travellers",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0055",
                "catg_three": "Frequent Local Mass Transit Traveler",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0056",
                "catg_three": "Frequent Local Travellers",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0057",
                "catg_three": "Frequent Train Travelers",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0058",
                "catg_three": "In-Market Travel",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0059",
                "catg_three": "Leisure Travellers",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0060",
                "catg_three": "Low Cost Airline Traveller",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smgbh0061",
                "catg_three": "Tour Enthusiasts",
                "catg_two": "Travel and Tourism",
                "catg_one": "Geo-behaviour"
            },
            {
                "columns_in_table": "smnbb0001",
                "catg_three": "Jewellery Shoppers",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0002",
                "catg_three": "Optician & Eyewear Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0003",
                "catg_three": "Cosmetics Shoppers",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0004",
                "catg_three": "Watches Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0005",
                "catg_three": "Handbag Shoppers",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0006",
                "catg_three": "Sunglasses Shoppers",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0007",
                "catg_three": "Accessories Shoppers",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0008",
                "catg_three": "Car Service Center Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0009",
                "catg_three": "Repair Services Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0010",
                "catg_three": "In-Market Automobile Buyers",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0011",
                "catg_three": "In-Market Motorcycle Buyers",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0012",
                "catg_three": "Used Car Showroom Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0013",
                "catg_three": "Truck Dealer Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0014",
                "catg_three": "Truck Repair Service Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0015",
                "catg_three": "New Car Showroom Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0016",
                "catg_three": "Car Accessories Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0017",
                "catg_three": "Electric Car Showroom Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0018",
                "catg_three": "Sports Car Showroom Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0019",
                "catg_three": "Hybrid Car Showroom Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0020",
                "catg_three": "Car Wash Center Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0021",
                "catg_three": "American Car Showroom Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0022",
                "catg_three": "European Car Showroom Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0023",
                "catg_three": "Motorcycles And Scooters Service Visitors",
                "catg_two": "Automobile",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0024",
                "catg_three": "Financial Institution Visitors",
                "catg_two": "Banking and Finance",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0025",
                "catg_three": "Loans & Mortgages Company Visitors",
                "catg_two": "Banking and Finance",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0026",
                "catg_three": "Insurance Company Visitors",
                "catg_two": "Banking and Finance",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0027",
                "catg_three": "Commercial Building Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0028",
                "catg_three": "Government Office Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0029",
                "catg_three": "Office Supplies Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0030",
                "catg_three": "Coworking Space Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0031",
                "catg_three": "Office Space Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0032",
                "catg_three": "Convention Centre Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0033",
                "catg_three": "Clothing And Accessories Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0034",
                "catg_three": "Footwear Shop Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0035",
                "catg_three": "Retail Fashion Shoppers",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0036",
                "catg_three": "Men''S Fashion Shoppers",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0037",
                "catg_three": "Luxury Fashion Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0038",
                "catg_three": "Womens''S Fashion Shoppers",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0039",
                "catg_three": "Lingerie Shoppers",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0040",
                "catg_three": "Swimwear Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0041",
                "catg_three": "Postal And Courier Visitors",
                "catg_two": "Communication and Social",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0042",
                "catg_three": "Telecommunication Services Visitors",
                "catg_two": "Communication and Social",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0043",
                "catg_three": "Residential Building Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0044",
                "catg_three": "Home And Living Shoppers",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0045",
                "catg_three": "Home Improvement & Diy Shoppers",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0046",
                "catg_three": "Home Improvement Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0047",
                "catg_three": "Furniture Shoppers",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0048",
                "catg_three": "Real Estate Agency And Showroom Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0049",
                "catg_three": "Hardware And Services Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0050",
                "catg_three": "Painting Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0051",
                "catg_three": "Moving Company Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0052",
                "catg_three": "Colleges And Universities Visitors",
                "catg_two": "Education and Learning",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0053",
                "catg_three": "Tutoring And Educational Services Visitors",
                "catg_two": "Education and Learning",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0054",
                "catg_three": "Bookshop Visitors",
                "catg_two": "Education and Learning",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0055",
                "catg_three": "Driving Schools Visitors",
                "catg_two": "Education and Learning",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0056",
                "catg_three": "Vocational Schools Visitors",
                "catg_two": "Education and Learning",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0057",
                "catg_three": "Electrical And Electronics Shoppers",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0058",
                "catg_three": "Baby And Toddler Shoppers",
                "catg_two": "Family planning, childcare and family",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0059",
                "catg_three": "Pregnancy And Sexual Health Visitors",
                "catg_two": "Family planning, childcare and family",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0060",
                "catg_three": "Restaurant Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0061",
                "catg_three": "Cafe And Lounge Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0062",
                "catg_three": "Pubs And Night Clubs Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0063",
                "catg_three": "Bar Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0064",
                "catg_three": "Fast Food Restaurant Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0065",
                "catg_three": "American Cuisine Customers",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0066",
                "catg_three": "Burger Restaurant Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0067",
                "catg_three": "Malaysian Cuisine Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0068",
                "catg_three": "Pizza Restaurant Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0069",
                "catg_three": "Thai Cuisine Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0070",
                "catg_three": "Seafood Restaurant Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0071",
                "catg_three": "International Cuisine Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0072",
                "catg_three": "Ice Cream Parlor Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0073",
                "catg_three": "Wine & Liquor Shoppers",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0074",
                "catg_three": "Mexican Cuisine Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0075",
                "catg_three": "Cake And Bakery Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0076",
                "catg_three": "Indian Cuisine Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0077",
                "catg_three": "Barbeque Restaurant Customers",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0078",
                "catg_three": "Chinese Cuisine Customers",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0079",
                "catg_three": "Italian Cuisine Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0080",
                "catg_three": "Grocery Store Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0081",
                "catg_three": "Convenience Store Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0082",
                "catg_three": "Supermarket Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0083",
                "catg_three": "Department Store Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0084",
                "catg_three": "Beauty Salons And Barbers Visitors",
                "catg_two": "Grooming and Personal Care",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0085",
                "catg_three": "Skin Care Visitors",
                "catg_two": "Grooming and Personal Care",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0086",
                "catg_three": "Gym And Fitness Centre Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0087",
                "catg_three": "Health And Diet Food Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0088",
                "catg_three": "Shopping Mall Visitors",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0089",
                "catg_three": "Shopping Area Visitors",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0090",
                "catg_three": "Park Visitors",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0091",
                "catg_three": "It And Digital Lifestyle Shoppers",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0092",
                "catg_three": "Theme Parks Visitors",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0093",
                "catg_three": "Zoo Visitors",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0094",
                "catg_three": "Museum Visitors",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0095",
                "catg_three": "Exhibition Centre Visitors",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0096",
                "catg_three": "Toys And Hobbies Shoppers",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0097",
                "catg_three": "Hotels Visitors",
                "catg_two": "Hotels",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0098",
                "catg_three": "Luxury Hotel Visitors",
                "catg_two": "Hotels",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0099",
                "catg_three": "Midscale Hotel Visitors",
                "catg_two": "Hotels",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0100",
                "catg_three": "Pharmacies Visitors",
                "catg_two": "Medical",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0101",
                "catg_three": "Dentists Visitors",
                "catg_two": "Medical",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0102",
                "catg_three": "Dermatologists Visitors",
                "catg_two": "Medical",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0103",
                "catg_three": "Gadgets, Mobile & Computer Shopper",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0104",
                "catg_three": "Cinemas Visitors",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0105",
                "catg_three": "Petrol Station Visitors",
                "catg_two": "Oil and Gas",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0106",
                "catg_three": "Places Of Worship Visitors",
                "catg_two": "Religion, Spirituality and Mental Wellness",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0107",
                "catg_three": "Sports Club Visitors",
                "catg_two": "Sports and Games",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0108",
                "catg_three": "Sporting Goods Shoppers",
                "catg_two": "Sports and Games",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0109",
                "catg_three": "Stadium And Arena Visitors",
                "catg_two": "Sports and Games",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0110",
                "catg_three": "Parking Area Visitors",
                "catg_two": "Travel and Tourism",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0111",
                "catg_three": "Train Commuters",
                "catg_two": "Travel and Tourism",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0112",
                "catg_three": "Bus Commuters",
                "catg_two": "Travel and Tourism",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0113",
                "catg_three": "Airport Visitors",
                "catg_two": "Travel and Tourism",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0114",
                "catg_three": "Car Rental Visitors",
                "catg_two": "Travel and Tourism",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0115",
                "catg_three": "Tourist Area Visitors",
                "catg_two": "Travel and Tourism",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0116",
                "catg_three": "Luggage And Bag Shop Visitors",
                "catg_two": "Travel and Tourism",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0117",
                "catg_three": "Taxi And Car Services Visitors",
                "catg_two": "Travel and Tourism",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0118",
                "catg_three": "Travel Agency Visitors",
                "catg_two": "Travel and Tourism",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0119",
                "catg_three": "Embassy Visitors",
                "catg_two": "Travel and Tourism",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smnbb0120",
                "catg_three": "International Airport Visitors",
                "catg_two": "Travel and Tourism",
                "catg_one": "Need-Based Behavior"
            },
            {
                "columns_in_table": "smoba0001",
                "catg_three": "Bblunt Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0002",
                "catg_three": "Asmi Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0003",
                "catg_three": "Bhima Jewellers Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0004",
                "catg_three": "Bluestone Jewellery Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0005",
                "catg_three": "Bombay Perfumery Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0006",
                "catg_three": "Bvlgari Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0007",
                "catg_three": "Candere Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0008",
                "catg_three": "Caratlane Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0009",
                "catg_three": "Chicco Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0010",
                "catg_three": "Clinique Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0011",
                "catg_three": "Coach Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0012",
                "catg_three": "Dune London Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0013",
                "catg_three": "Emporio Armani Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0014",
                "catg_three": "Ethos Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0015",
                "catg_three": "Favre Leube Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0016",
                "catg_three": "Ferragamo Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0017",
                "catg_three": "Forevermark Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0018",
                "catg_three": "Frederique Constant Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0019",
                "catg_three": "Gili Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0020",
                "catg_three": "GKB Opticals Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0021",
                "catg_three": "GRT Jewellers Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0022",
                "catg_three": "Health & Glow Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0023",
                "catg_three": "Joyalukkas Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0024",
                "catg_three": "Just In Time Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0025",
                "catg_three": "Kalyan Jewellers Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0026",
                "catg_three": "Lakm?ï¿½?? India Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0027",
                "catg_three": "Lawrence and Mayo Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0028",
                "catg_three": "Lenskart Optical Store Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0029",
                "catg_three": "Longines Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0030",
                "catg_three": "Malabar Gold & Diamonds Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0031",
                "catg_three": "Mia By Tanishq Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0032",
                "catg_three": "Michael Kors Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0033",
                "catg_three": "Montblanc Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0034",
                "catg_three": "Native Mt Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0035",
                "catg_three": "ORRA Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0036",
                "catg_three": "Park Avenue Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0037",
                "catg_three": "Rado Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0038",
                "catg_three": "Raymond Weil Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0039",
                "catg_three": "Reliance Jewels Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0040",
                "catg_three": "Seiko Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0041",
                "catg_three": "TAG Heuer Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0042",
                "catg_three": "Tanishq Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0043",
                "catg_three": "Titan Eyeplus Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0044",
                "catg_three": "Tumi Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0045",
                "catg_three": "Vision Express Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0046",
                "catg_three": "World Of Titan Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0047",
                "catg_three": "Zimson Visitors",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0048",
                "catg_three": "Audi Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0049",
                "catg_three": "Bajaj Auto Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0050",
                "catg_three": "Benelli Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0051",
                "catg_three": "BMW Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0052",
                "catg_three": "Carzonrent Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0053",
                "catg_three": "CEAT Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0054",
                "catg_three": "Chevrolet Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0055",
                "catg_three": "Fiat Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0056",
                "catg_three": "Ford Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0057",
                "catg_three": "Harley-Davidson Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0058",
                "catg_three": "Hero Motocorp Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0059",
                "catg_three": "Hero Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0060",
                "catg_three": "Honda Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0061",
                "catg_three": "Hyundai Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0062",
                "catg_three": "Isuzu Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0063",
                "catg_three": "Jaguar Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0064",
                "catg_three": "Jeep Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0065",
                "catg_three": "Kawasaki Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0066",
                "catg_three": "KTM Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0067",
                "catg_three": "Land Rover Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0068",
                "catg_three": "Mahindra (Truck Dealer) Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0069",
                "catg_three": "Mahindra Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0070",
                "catg_three": "Maruti Nexa Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0071",
                "catg_three": "Maruti Suzuki Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0072",
                "catg_three": "Mercedes-Benz Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0073",
                "catg_three": "MG Motor Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0074",
                "catg_three": "Michelin Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0075",
                "catg_three": "Mitsubishi Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0076",
                "catg_three": "Nissan Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0077",
                "catg_three": "Renault India Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0078",
                "catg_three": "Royal Enfield Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0079",
                "catg_three": "Skoda Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0080",
                "catg_three": "Tata Motors (Truck Dealer) Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0081",
                "catg_three": "Tata Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0082",
                "catg_three": "Toyota Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0083",
                "catg_three": "TVS Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0084",
                "catg_three": "Volkswagen Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0085",
                "catg_three": "Volvo Visitors",
                "catg_two": "Automobile",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0086",
                "catg_three": "Andhra Pradesh Grameena Vikas Bank Visitors",
                "catg_two": "Banking and Finance",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0087",
                "catg_three": "Bajaj Finserv Visitors",
                "catg_two": "Banking and Finance",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0088",
                "catg_three": "Bank of Baroda Visitors",
                "catg_two": "Banking and Finance",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0089",
                "catg_three": "HDFC Life Visitors",
                "catg_two": "Banking and Finance",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0090",
                "catg_three": "ICICI Bank Visitors",
                "catg_two": "Banking and Finance",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0091",
                "catg_three": "Karnataka Vikas Grameena Bank Visitors",
                "catg_two": "Banking and Finance",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0092",
                "catg_three": "Muthoot Finance Ltd Visitors",
                "catg_two": "Banking and Finance",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0093",
                "catg_three": "Western Union Visitors",
                "catg_two": "Banking and Finance",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0094",
                "catg_three": "91 Springboard Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0095",
                "catg_three": "Awfis Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0096",
                "catg_three": "Cowrks Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0097",
                "catg_three": "Indiqube Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0098",
                "catg_three": "KPMG Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0099",
                "catg_three": "Regus Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0100",
                "catg_three": "Staples Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0101",
                "catg_three": "WeWork Visitors",
                "catg_two": "Business and Official",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0102",
                "catg_three": "Chicco Visitors",
                "catg_two": "Childcare",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0103",
                "catg_three": "Emporio Armani Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0104",
                "catg_three": "Ferragamo Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0105",
                "catg_three": "Harley-Davidson Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0106",
                "catg_three": "All The Plus Size Store Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0107",
                "catg_three": "Allen Solly Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0108",
                "catg_three": "Anita Dongre Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0109",
                "catg_three": "Armani Exchange Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0110",
                "catg_three": "Arrow Store Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0111",
                "catg_three": "Aza Fashion Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0112",
                "catg_three": "Bata Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0113",
                "catg_three": "Bindal Apparels Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0114",
                "catg_three": "Blackberrys Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0115",
                "catg_three": "Bossini Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0116",
                "catg_three": "Brooks Brothers Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0117",
                "catg_three": "Calvin Klein Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0118",
                "catg_three": "Celio Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0119",
                "catg_three": "Chanel Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0120",
                "catg_three": "Clothes Rack Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0121",
                "catg_three": "Converse Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0122",
                "catg_three": "Diesel Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0123",
                "catg_three": "Ethnix By Raymond Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0124",
                "catg_three": "Fabindia Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0125",
                "catg_three": "Flying Machine Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0126",
                "catg_three": "Forever 21 Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0127",
                "catg_three": "French Connection Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0128",
                "catg_three": "GAS Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0129",
                "catg_three": "Globus Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0130",
                "catg_three": "Go Colors Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0131",
                "catg_three": "Good Earth Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0132",
                "catg_three": "G-Star Raw Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0133",
                "catg_three": "Guess Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0134",
                "catg_three": "H&M Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0135",
                "catg_three": "Hugo Boss Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0136",
                "catg_three": "Hush Puppies Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0137",
                "catg_three": "Indian Terrain Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0138",
                "catg_three": "Indigo Nation Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0139",
                "catg_three": "Jack & Jones Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0140",
                "catg_three": "John Jacobs Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0141",
                "catg_three": "Khadim''s Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0142",
                "catg_three": "La Lingerie Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0143",
                "catg_three": "La Senza Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0144",
                "catg_three": "Lacoste Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0145",
                "catg_three": "Lee Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0146",
                "catg_three": "Levi''s Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0147",
                "catg_three": "Liberty Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0148",
                "catg_three": "Lifestyle Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0149",
                "catg_three": "Louis Philippe Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0150",
                "catg_three": "Manyavar Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0151",
                "catg_three": "Marks & Spencer Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0152",
                "catg_three": "Max Fashion Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0153",
                "catg_three": "Metro Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0154",
                "catg_three": "Mochi Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0155",
                "catg_three": "Monte Carlo Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0156",
                "catg_three": "Mothercare Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0157",
                "catg_three": "Mufti Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0158",
                "catg_three": "Nalli Silks Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0159",
                "catg_three": "Nautica Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0160",
                "catg_three": "Nicobar Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0161",
                "catg_three": "Ogaan Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0162",
                "catg_three": "Only Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0163",
                "catg_three": "Pantaloons Store Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0164",
                "catg_three": "Peter England Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0165",
                "catg_three": "Planet Fashion Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0166",
                "catg_three": "Prada Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0167",
                "catg_three": "Red Tape Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0168",
                "catg_three": "Reebok Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0169",
                "catg_three": "Reliance Footprint Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0170",
                "catg_three": "Reliance Trends Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0171",
                "catg_three": "Ritu Kumar Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0172",
                "catg_three": "Scotch & Soda Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0173",
                "catg_three": "Shingora Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0174",
                "catg_three": "Shoppers Stop Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0175",
                "catg_three": "Skechers Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0176",
                "catg_three": "Spykar Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0177",
                "catg_three": "Steve Madden Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0178",
                "catg_three": "Superdry Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0179",
                "catg_three": "Tata Cliq Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0180",
                "catg_three": "The Raymond Shop Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0181",
                "catg_three": "Tommy Hilfiger Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0182",
                "catg_three": "United Colors of Benetton Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0183",
                "catg_three": "Urban Ladder Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0184",
                "catg_three": "Van Heusen Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0185",
                "catg_three": "Vero Moda Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0186",
                "catg_three": "Westside Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0187",
                "catg_three": "Wildcraft Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0188",
                "catg_three": "Woodland Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0189",
                "catg_three": "Wrangler Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0190",
                "catg_three": "Zara Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0191",
                "catg_three": "Zivame Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0192",
                "catg_three": "Zodiac Visitors",
                "catg_two": "Clothing, Lifestyle and Fashion",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0193",
                "catg_three": "DHL Visitors",
                "catg_two": "Communication and Social",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0194",
                "catg_three": "DTDC Visitors",
                "catg_two": "Communication and Social",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0195",
                "catg_three": "FedEx Visitors",
                "catg_two": "Communication and Social",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0196",
                "catg_three": "India Post Visitors",
                "catg_two": "Communication and Social",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0197",
                "catg_three": "acer Visitors",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0198",
                "catg_three": "Dell Exclusive Store Visitors",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0199",
                "catg_three": "HP World Visitors",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0200",
                "catg_three": "Lenovo Exclusive Store Visitors",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0201",
                "catg_three": "Good Earth Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0202",
                "catg_three": "Ajmera Bliss Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0203",
                "catg_three": "Asian Paints Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0204",
                "catg_three": "DAMRO Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0205",
                "catg_three": "Dulux Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0206",
                "catg_three": "Godrej Interio Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0207",
                "catg_three": "Home Centre Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0208",
                "catg_three": "Home Furniture Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0209",
                "catg_three": "Home Town Furniture Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0210",
                "catg_three": "JLL Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0211",
                "catg_three": "Kajaria Ceramics Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0212",
                "catg_three": "Kurlon Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0213",
                "catg_three": "Lakshya City by Poddar Housing Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0214",
                "catg_three": "Lodha premier Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0332",
                "catg_three": "OPPO Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0215",
                "catg_three": "Nilkamal Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0216",
                "catg_three": "Orient Bell Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0217",
                "catg_three": "Phoenix Mills Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0218",
                "catg_three": "Provident Palm Vista Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0219",
                "catg_three": "Regency Anantam Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0220",
                "catg_three": "Regency Antilia Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0221",
                "catg_three": "Ritu Kumar Home Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0222",
                "catg_three": "Runwal Gardens Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0223",
                "catg_three": "Runwal my city Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0224",
                "catg_three": "Shree Sai Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0225",
                "catg_three": "Somany Ceramics Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0226",
                "catg_three": "Tharwani Solitaire Visitors",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0227",
                "catg_three": "Bosch Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0228",
                "catg_three": "Cex Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0229",
                "catg_three": "Croma Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0230",
                "catg_three": "Daewoo Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0231",
                "catg_three": "Ezone Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0232",
                "catg_three": "Haier Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0233",
                "catg_three": "IFB Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0234",
                "catg_three": "Jio Digital Life Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0235",
                "catg_three": "LG Best Shop Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0236",
                "catg_three": "Panasonic Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0237",
                "catg_three": "Poorvika Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0238",
                "catg_three": "Reliance Digital Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0239",
                "catg_three": "Reliance Digital Xpress Mini Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0240",
                "catg_three": "Samsung Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0241",
                "catg_three": "Sony Center Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0242",
                "catg_three": "Viveks Visitors",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0243",
                "catg_three": "Hamleys Visitors",
                "catg_two": "Family planning, childcare and family",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0244",
                "catg_three": "Amul Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0245",
                "catg_three": "Barista Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0246",
                "catg_three": "Baskin Robbins Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0247",
                "catg_three": "Budweiser Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0248",
                "catg_three": "Burger King Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0249",
                "catg_three": "Cafe Coffee Day Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0250",
                "catg_three": "Costa Coffee Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0251",
                "catg_three": "Domino''s Pizza Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0252",
                "catg_three": "Dunkin Donuts Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0253",
                "catg_three": "Food World Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0254",
                "catg_three": "Haagen Dazs Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0255",
                "catg_three": "Hard Rock Cafe Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0256",
                "catg_three": "KFC Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0257",
                "catg_three": "Krispy Kreme Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0258",
                "catg_three": "Marrybrown Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0259",
                "catg_three": "McDonald''s Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0260",
                "catg_three": "Mother Diary Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0261",
                "catg_three": "Nando''s Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0262",
                "catg_three": "Pizza Hut Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0263",
                "catg_three": "Starbucks Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0264",
                "catg_three": "Subway Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0265",
                "catg_three": "Taco Bell Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0266",
                "catg_three": "TGI Friday''s Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0267",
                "catg_three": "The Coffee Bean & Tea Leaf Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0268",
                "catg_three": "The French Loaf Visitors",
                "catg_two": "Food and Beverages",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0269",
                "catg_three": "Big Bazaar Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0270",
                "catg_three": "Big Mart Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0271",
                "catg_three": "Daily Needs Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0272",
                "catg_three": "D-Mart Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0273",
                "catg_three": "Dorabjee Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0274",
                "catg_three": "Easyday Club Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0275",
                "catg_three": "Godrej Nature''s Basket Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0276",
                "catg_three": "HyperCity Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0277",
                "catg_three": "More Supermarket Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0278",
                "catg_three": "Nilgiri''s Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0279",
                "catg_three": "Patanjali Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0280",
                "catg_three": "Reliance Fresh Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0281",
                "catg_three": "Reliance SMART Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0282",
                "catg_three": "Society Stores Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0283",
                "catg_three": "Spar Hypermarket Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0284",
                "catg_three": "Spencer''s Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0285",
                "catg_three": "Vishal Mega Mart Visitors",
                "catg_two": "Grocery and Supermarkets",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0286",
                "catg_three": "Bblunt Visitors",
                "catg_two": "Grooming and Personal Care",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0287",
                "catg_three": "Jawed Habib Hair & Beauty Salon Visitors",
                "catg_two": "Grooming and Personal Care",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0288",
                "catg_three": "Kaya skin clinic Visitors",
                "catg_two": "Grooming and Personal Care",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0289",
                "catg_three": "Style Spa Visitors",
                "catg_two": "Grooming and Personal Care",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0290",
                "catg_three": "The Body Shop Visitors",
                "catg_two": "Grooming and Personal Care",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0291",
                "catg_three": "VLCC Visitors",
                "catg_two": "Grooming and Personal Care",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0292",
                "catg_three": "Adidas Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0293",
                "catg_three": "ASICS Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0294",
                "catg_three": "Basics Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0295",
                "catg_three": "Decathlon Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0296",
                "catg_three": "Fila Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0297",
                "catg_three": "Fitness First Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0298",
                "catg_three": "Gold''s Gym Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0299",
                "catg_three": "Nike Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0300",
                "catg_three": "Puma Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0301",
                "catg_three": "Snap Fitness Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0302",
                "catg_three": "Speedo Visitors",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0303",
                "catg_three": "Four Seasons Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0304",
                "catg_three": "Grand Mercure Ambassador Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0305",
                "catg_three": "Hilton Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0306",
                "catg_three": "Hyatt Centric Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0307",
                "catg_three": "Hyatt Place Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0308",
                "catg_three": "Hyatt Regency Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0309",
                "catg_three": "Hyatt Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0310",
                "catg_three": "ibis Hotel Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0311",
                "catg_three": "Novotel Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0312",
                "catg_three": "Sarovar Hotels Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0313",
                "catg_three": "Taj Club House Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0314",
                "catg_three": "Taj Hotel Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0315",
                "catg_three": "The Leela Palace Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0316",
                "catg_three": "The Oberoi Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0317",
                "catg_three": "Treebo Hotels Visitors",
                "catg_two": "Hotels",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0318",
                "catg_three": "Apollo Hospital Visitors",
                "catg_two": "Medical",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0319",
                "catg_three": "Apollo Pharmacy Visitors",
                "catg_two": "Medical",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0320",
                "catg_three": "Himalaya Visitors",
                "catg_two": "Medical",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0321",
                "catg_three": "MedPlus Visitors",
                "catg_two": "Medical",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0322",
                "catg_three": "Thulasi pharmacy Visitors",
                "catg_two": "Medical",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0323",
                "catg_three": "Panasonic Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0324",
                "catg_three": "Airtel Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0325",
                "catg_three": "Apple Store Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0326",
                "catg_three": "Big C Mobiles Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0327",
                "catg_three": "Idea Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0328",
                "catg_three": "Jockey Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0329",
                "catg_three": "Lot Mobiles Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0330",
                "catg_three": "Moto Hub Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0331",
                "catg_three": "Oneplus Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0333",
                "catg_three": "Sangeetha Mobiles Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0334",
                "catg_three": "Vivo Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0335",
                "catg_three": "Vodafone Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0336",
                "catg_three": "Xiaomi Visitors",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0337",
                "catg_three": "BIG Cinemas Visitors",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0338",
                "catg_three": "Carnival Cinemas Visitors",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0339",
                "catg_three": "CineMAX Visitors",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0340",
                "catg_three": "Cinepolis Visitors",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0341",
                "catg_three": "Fun Cinemas Visitors",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0342",
                "catg_three": "INOX Visitors",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0343",
                "catg_three": "PVR Cinemas Visitors",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0344",
                "catg_three": "Reliance Jio Visitors",
                "catg_two": "Movies and Entertainment",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0345",
                "catg_three": "Bharat Petroleum Visitors",
                "catg_two": "Oil and Gas",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0346",
                "catg_three": "Essar Oil Visitors",
                "catg_two": "Oil and Gas",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0347",
                "catg_three": "Hindustan Petroleum Visitors",
                "catg_two": "Oil and Gas",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0348",
                "catg_three": "HP Gas Visitors",
                "catg_two": "Oil and Gas",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0349",
                "catg_three": "Indane Gas Visitors",
                "catg_two": "Oil and Gas",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0350",
                "catg_three": "Indian Oil Visitors",
                "catg_two": "Oil and Gas",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0351",
                "catg_three": "Reliance Petroleum Visitors",
                "catg_two": "Oil and Gas",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0352",
                "catg_three": "Shell Visitors",
                "catg_two": "Oil and Gas",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0353",
                "catg_three": "Brahma Kumaris Visitors",
                "catg_two": "Religion, Spirituality and Mental Wellness",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smoba0354",
                "catg_three": "Bose Visitors",
                "catg_two": "Sound and Music",
                "catg_one": "Offline Brand Affinity"
            },
            {
                "columns_in_table": "smonb0001",
                "catg_three": "Automotive Mid-range",
                "catg_two": "Automobile",
                "catg_one": "Online Brand Affinity"
            },
            {
                "columns_in_table": "smonb0002",
                "catg_three": "Airbus",
                "catg_two": "Automobile",
                "catg_one": "Online Brand Affinity"
            },
            {
                "columns_in_table": "smonb0003",
                "catg_three": "Skoda",
                "catg_two": "Automobile",
                "catg_one": "Online Brand Affinity"
            },
            {
                "columns_in_table": "smonb0004",
                "catg_three": "Banking Services",
                "catg_two": "Banking and Finance",
                "catg_one": "Online Brand Affinity"
            },
            {
                "columns_in_table": "smonb0005",
                "catg_three": "Computer/PC",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Online Brand Affinity"
            },
            {
                "columns_in_table": "smonb0006",
                "catg_three": "Microsoft",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Online Brand Affinity"
            },
            {
                "columns_in_table": "smonb0007",
                "catg_three": "Fast Food",
                "catg_two": "Food and Beverages",
                "catg_one": "Online Brand Affinity"
            },
            {
                "columns_in_table": "smonb0008",
                "catg_three": "Smartphone",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Online Brand Affinity"
            },
            {
                "columns_in_table": "smopb0001",
                "catg_three": "Health & Beauty",
                "catg_two": "Accessories, Cosmetics and Beauty",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0002",
                "catg_three": "Animals & Pet",
                "catg_two": "Animals and Pets",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0003",
                "catg_three": "Automotive",
                "catg_two": "Automobile",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0004",
                "catg_three": "Vehicle Parts & Accessories",
                "catg_two": "Automobile",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0005",
                "catg_three": "Finance",
                "catg_two": "Banking and Finance",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0006",
                "catg_three": "Investments",
                "catg_two": "Banking and Finance",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0007",
                "catg_three": "Communications",
                "catg_two": "Communication and Social",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0008",
                "catg_three": "Computers",
                "catg_two": "Computers, Softwares and Applications",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0009",
                "catg_three": "Home & Garden",
                "catg_two": "Construction, Real Estate, Home Maintainance and Décor",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0010",
                "catg_three": "Education",
                "catg_two": "Education and Learning",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0011",
                "catg_three": "Books",
                "catg_two": "Education and Learning",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0012",
                "catg_three": "Language School",
                "catg_two": "Education and Learning",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0013",
                "catg_three": "Electronics",
                "catg_two": "Electronics and Appliances",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0014",
                "catg_three": "Baby Toys",
                "catg_two": "Family planning, childcare and family",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0015",
                "catg_three": "Health & Beauty",
                "catg_two": "Fitness & Accessories",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0016",
                "catg_three": "Health Care: Fitness & Nutrition",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0017",
                "catg_three": "Outdoor Recreation: Running",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0018",
                "catg_three": "Exercise & Fitness",
                "catg_two": "Health, Fitness and Accessories",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0019",
                "catg_three": "Hobbies & Interets",
                "catg_two": "Hobbies and Recreations",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0020",
                "catg_three": "Portable: Mobile Phones",
                "catg_two": "Mobiles and Applications",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0021",
                "catg_three": "Cameras: Video Cameras",
                "catg_two": "Photography",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0022",
                "catg_three": "Cameras: Digital Cameras",
                "catg_two": "Photography",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0023",
                "catg_three": "Technology & Computing",
                "catg_two": "Science and Technology",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0024",
                "catg_three": "Music",
                "catg_two": "Sound and Music",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0025",
                "catg_three": "Audio",
                "catg_two": "Sound and Music",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0026",
                "catg_three": "Team Sports",
                "catg_two": "Sports and Games",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0027",
                "catg_three": "Dvds & Videos",
                "catg_two": "Sports and Games",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0028",
                "catg_three": "Games",
                "catg_two": "Sports and Games",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0029",
                "catg_three": "Video Game Consoles",
                "catg_two": "Sports and Games",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0030",
                "catg_three": "Video Game Software",
                "catg_two": "Sports and Games",
                "catg_one": "Online Purchase Behavior"
            },
            {
                "columns_in_table": "smopb0031",
                "catg_three": "Travel",
                "catg_two": "Travel and Tourism",
                "catg_one": "Online Purchase Behavior"
            }
        ];
        
        const tableName_columnName = await db.query(
            `SELECT * FROM hexgrid08 where hexid08 IN('`+hexid08+`')`
            );
            
            var hexids = [];
            for(var i=0;i<tableName_columnName.length;i++){
                hexids[i] = tableName_columnName[i].id;
            }
            
            console.log(JSON.stringify(hexids));
            const hexMap = [];
            let catgOne = "";
            let catgTwo = "";
            let catgThree = "";     
            
            date_ob = new Date();
            hours = date_ob.getHours();
            minutes = date_ob.getMinutes();
            seconds = date_ob.getSeconds();
            console.log("hexidloop starts at: "+hours + ":" + minutes+":"+seconds);
            for(var hexidloop = 0; hexidloop< hexids.length; hexidloop++){
                
                const affinity_a = await db.query(`select * from hex08_cs_offline_brand_affinity_a where hex08_key in(`+hexids[hexidloop]+`)`);
                
                for(var j=0;j<affinity_a.length;j++){
                    for (var key in affinity_a[j]) {
                        if(key !== "id" && key !== "hex08_key"){
                            for(let mapItr = 0;mapItr<mapCsIndicator.length;mapItr++){
                                if(mapCsIndicator[mapItr].columns_in_table == key){
                                    catgOne = mapCsIndicator[mapItr].catg_one
                                    catgTwo = mapCsIndicator[mapItr].catg_two
                                    catgThree = mapCsIndicator[mapItr].catg_three
                                }                        
                            }
                            hexMap.push({key:key, val:affinity_a[j][key], catgOne:catgOne, catgTwo:catgTwo, catgThree:catgThree})
                        }
                    }
                }
                
                date_ob = new Date();
                hours = date_ob.getHours();
                minutes = date_ob.getMinutes();
                seconds = date_ob.getSeconds();
                console.log("after affinity_a loop: "+hours + ":" + minutes+":"+seconds);
                
                const affinity_b = await db.query(`select * from hex08_cs_offline_brand_affinity_b where hex08_key in(`+hexids[hexidloop]+`)`);
                
                for(var j=0;j<affinity_b.length;j++){
                    for (var key in affinity_b[j]) {
                        if(key !== "id" && key !== "hex08_key"){
                            for(let mapItr = 0;mapItr<mapCsIndicator.length;mapItr++){
                                if(mapCsIndicator[mapItr].columns_in_table == key){
                                    catgOne = mapCsIndicator[mapItr].catg_one
                                    catgTwo = mapCsIndicator[mapItr].catg_two
                                    catgThree = mapCsIndicator[mapItr].catg_three
                                }                        
                            }
                            hexMap.push({key:key, val:affinity_b[j][key], catgOne:catgOne, catgTwo:catgTwo, catgThree:catgThree})
                        }
                    }
                }
                
                date_ob = new Date();
                hours = date_ob.getHours();
                minutes = date_ob.getMinutes();
                seconds = date_ob.getSeconds();
                console.log("after affinity_b loop: "+hours + ":" + minutes+":"+seconds);
                
                const affinity_c = await db.query(`select * from hex08_cs_offline_brand_affinity_c where hex08_key in(`+hexids[hexidloop]+`)`);
                
                for(var j=0;j<affinity_c.length;j++){
                    for (var key in affinity_c[j]) {
                        if(key !== "id" && key !== "hex08_key"){
                            for(let mapItr = 0;mapItr<mapCsIndicator.length;mapItr++){
                                if(mapCsIndicator[mapItr].columns_in_table == key){
                                    catgOne = mapCsIndicator[mapItr].catg_one
                                    catgTwo = mapCsIndicator[mapItr].catg_two
                                    catgThree = mapCsIndicator[mapItr].catg_three
                                }                        
                            }
                            hexMap.push({key:key, val:affinity_c[j][key], catgOne:catgOne, catgTwo:catgTwo, catgThree:catgThree})
                        }
                    }
                }
                
                date_ob = new Date();
                hours = date_ob.getHours();
                minutes = date_ob.getMinutes();
                seconds = date_ob.getSeconds();
                console.log("after affinity_c loop: "+hours + ":" + minutes+":"+seconds);
                
                const brows_topic_interest = await db.query(`select * from hex08_cs_brows_topi_interst where hex08_key in(`+hexids[hexidloop]+`)`);
                
                for(var j=0;j<brows_topic_interest.length;j++){
                    for (var key in brows_topic_interest[j]) {
                        if(key !== "id" && key !== "hex08_key"){
                            for(let mapItr = 0;mapItr<mapCsIndicator.length;mapItr++){
                                if(mapCsIndicator[mapItr].columns_in_table == key){
                                    catgOne = mapCsIndicator[mapItr].catg_one
                                    catgTwo = mapCsIndicator[mapItr].catg_two
                                    catgThree = mapCsIndicator[mapItr].catg_three
                                }                        
                            }
                            hexMap.push({key:key, val:brows_topic_interest[j][key], catgOne:catgOne, catgTwo:catgTwo, catgThree:catgThree})
                        }
                    }
                }
                
                date_ob = new Date();
                hours = date_ob.getHours();
                minutes = date_ob.getMinutes();
                seconds = date_ob.getSeconds();
                console.log("after brows_topic_interest loop: "+hours + ":" + minutes+":"+seconds);
                
                const online_purchase_behavior = await db.query(`select * from hex08_cs_online_purchase_behavior where hex08_key in(`+hexids[hexidloop]+`)`);
                
                for(var j=0;j<online_purchase_behavior.length;j++){
                    for (var key in online_purchase_behavior[j]) {
                        if(key !== "id" && key !== "hex08_key"){
                            for(let mapItr = 0;mapItr<mapCsIndicator.length;mapItr++){
                                if(mapCsIndicator[mapItr].columns_in_table == key){
                                    catgOne = mapCsIndicator[mapItr].catg_one
                                    catgTwo = mapCsIndicator[mapItr].catg_two
                                    catgThree = mapCsIndicator[mapItr].catg_three
                                }                        
                            }
                            hexMap.push({key:key, val:online_purchase_behavior[j][key], catgOne:catgOne, catgTwo:catgTwo, catgThree:catgThree})
                        }
                    }
                }
                
                date_ob = new Date();
                hours = date_ob.getHours();
                minutes = date_ob.getMinutes();
                seconds = date_ob.getSeconds();
                console.log("after online_purchase_behavior loop: "+hours + ":" + minutes+":"+seconds);
                
                const online_brand_affinity = await db.query(`select * from hex08_cs_online_brand_affinity where hex08_key in(`+hexids[hexidloop]+`)`);
                
                for(var j=0;j<online_brand_affinity.length;j++){
                    for (var key in online_brand_affinity[j]) {
                        if(key !== "id" && key !== "hex08_key"){
                            for(let mapItr = 0;mapItr<mapCsIndicator.length;mapItr++){
                                if(mapCsIndicator[mapItr].columns_in_table == key){
                                    catgOne = mapCsIndicator[mapItr].catg_one
                                    catgTwo = mapCsIndicator[mapItr].catg_two
                                    catgThree = mapCsIndicator[mapItr].catg_three
                                }                        
                            }
                            hexMap.push({key:key, val:online_brand_affinity[j][key], catgOne:catgOne, catgTwo:catgTwo, catgThree:catgThree})
                        }
                    }
                }
                
                date_ob = new Date();
                hours = date_ob.getHours();
                minutes = date_ob.getMinutes();
                seconds = date_ob.getSeconds();
                console.log("after online_brand_affinity loop: "+hours + ":" + minutes+":"+seconds);
                
                const geo_behaviour = await db.query(`select * from hex08_cs_geo_behaviour where hex08_key in(`+hexids[hexidloop]+`)`);
                
                for(var j=0;j<geo_behaviour.length;j++){
                    for (var key in geo_behaviour[j]) {
                        if(key !== "id" && key !== "hex08_key"){
                            for(let mapItr = 0;mapItr<mapCsIndicator.length;mapItr++){
                                if(mapCsIndicator[mapItr].columns_in_table == key){
                                    catgOne = mapCsIndicator[mapItr].catg_one
                                    catgTwo = mapCsIndicator[mapItr].catg_two
                                    catgThree = mapCsIndicator[mapItr].catg_three
                                }                        
                            }
                            hexMap.push({key:key, val:geo_behaviour[j][key], catgOne:catgOne, catgTwo:catgTwo, catgThree:catgThree})
                        }
                    }
                }
                
                date_ob = new Date();
                hours = date_ob.getHours();
                minutes = date_ob.getMinutes();
                seconds = date_ob.getSeconds();
                console.log("after geo_behaviour loop: "+hours + ":" + minutes+":"+seconds);
                
                const need_based_behaviour = await db.query(`select * from hex08_cs_need_based_behaviour where hex08_key in(`+hexids[hexidloop]+`)`);
                
                for(var j=0;j<need_based_behaviour.length;j++){
                    for (var key in need_based_behaviour[j]) {
                        if(key !== "id" && key !== "hex08_key"){
                            for(let mapItr = 0;mapItr<mapCsIndicator.length;mapItr++){
                                if(mapCsIndicator[mapItr].columns_in_table == key){
                                    catgOne = mapCsIndicator[mapItr].catg_one
                                    catgTwo = mapCsIndicator[mapItr].catg_two
                                    catgThree = mapCsIndicator[mapItr].catg_three
                                }                        
                            }
                            hexMap.push({key:key, val:need_based_behaviour[j][key], catgOne:catgOne, catgTwo:catgTwo, catgThree:catgThree})
                        }
                    }
                }
                
                date_ob = new Date();
                hours = date_ob.getHours();
                minutes = date_ob.getMinutes();
                seconds = date_ob.getSeconds();
                console.log("after need_based_behaviour loop: "+hours + ":" + minutes+":"+seconds);
                
            }
            
            var sampleJSON = {
                "title":"",
                "children":[
                    {
                        "name":"Browsed topics and interests",
                        "size" :"",
                        "children":[
                            {
                                "name":"Accessories, Cosmetics and Beauty",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Animals and Pets",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Art and Crafts",
                                "size" :"",
                                
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Automobile",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Banking and Finance",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Business and Official",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Clothing, Lifestyle and Fashion",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Communication and Social",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Computers, Softwares and Applications",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Construction, Real Estate, Home Maintainance and Décor",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Education and Learning",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Environment and Sustainability",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Family planning, childcare and family",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Food and Beverages",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"General Knowedge and News",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Health, Fitness and Accessories",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Hobbies and Recreations",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Medical",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Miscellaneous",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Mobiles and Applications",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Movies and Entertainment",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Photography",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Science and Technology",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Shopping habits",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Sound and Music",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Sports and Games",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Travel and Tourism",
                                "size" :"",
                                "children":[
                                    
                                ]
                            }
                        ]
                    },
                    {
                        "name":"Geo-behaviour",
                        "size" :"",
                        "children":[
                            {
                                "name":"Accessories, Cosmetics and Beauty",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Automobile",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Banking and Finance",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Business and Official",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Construction, Real Estate, Home Maintainance and Décor",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Education and Learning",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Electronics and Appliances",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Family planning, childcare and family",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Food and Beverages",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Grocery and Supermarkets",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Health, Fitness and Accessories",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Hobbies and Recreations",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Hotels",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Medical",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Science and Technology",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Shopping habits",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Socio-economic standing",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Sports and Games",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Travel and Tourism",
                                "size" :"",
                                "children":[
                                    
                                ]
                            }
                        ]
                    },
                    {
                        "name":"Need-Based Behavior",
                        "size" :"",
                        "children":[
                            {
                                "name":"Accessories, Cosmetics and Beauty",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Automobile",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Banking and Finance",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Business and Official",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Clothing, Lifestyle and Fashion",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Communication and Social",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Construction, Real Estate, Home Maintainance and Décor",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Education and Learning",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Electronics and Appliances",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Family planning, childcare and family",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Food and Beverages",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Grocery and Supermarkets",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Grooming and Personal Care",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Health, Fitness and Accessories",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Hobbies and Recreations",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Hotels",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Medical",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Mobiles and Applications",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Movies and Entertainment",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Oil and Gas",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Religion, Spirituality and Mental Wellness",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Sports and Games",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Travel and Tourism",
                                "size" :"",
                                "children":[
                                    
                                ]
                            }
                        ]
                    },
                    {
                        "name":"Offline Brand Affinity",
                        "size" :"",
                        "children":[
                            {
                                "name":"Accessories, Cosmetics and Beauty",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Automobile",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Banking and Finance",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Business and Official",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Childcare",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Clothing, Lifestyle and Fashion",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Communication and Social",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Computers, Softwares and Applications",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Construction, Real Estate, Home Maintainance and Décor",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Electronics and Appliances",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Family planning, childcare and family",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Food and Beverages",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Grocery and Supermarkets",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Grooming and Personal Care",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Health, Fitness and Accessories",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Hotels",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Medical",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Mobiles and Applications",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Movies and Entertainment",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Oil and Gas",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Religion, Spirituality and Mental Wellness",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Sound and Music",
                                "size" :"",
                                "children":[
                                    
                                ]
                            }
                        ]
                    },
                    {
                        "name":"Online Brand Affinity",
                        "size" :"",
                        "children":[
                            {
                                "name":"Automobile",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Banking and Finance",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Computers, Softwares and Applications",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Food and Beverages",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Mobiles and Applications",
                                "size" :"",
                                "children":[
                                    
                                ]
                            }
                        ]
                    },
                    {
                        "name":"Online Purchase Behavior",
                        "size" :"",
                        "children":[
                            {
                                "name":"Accessories, Cosmetics and Beauty",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Animals and Pets",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Automobile",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Banking and Finance",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Communication and Social",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Computers, Softwares and Applications",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Construction, Real Estate, Home Maintainance and Décor",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Education and Learning",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Electronics and Appliances",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Family planning, childcare and family",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Fitness & Accessories",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Health, Fitness and Accessories",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Hobbies and Recreations",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Mobiles and Applications",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Photography",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Science and Technology",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Sound and Music",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Sports and Games",
                                "size" :"",
                                "children":[
                                    
                                ]
                            },
                            {
                                "name":"Travel and Tourism",
                                "size" :"",
                                "children":[
                                    
                                ]
                            }
                        ]
                    }
                ]
            };
            
            sampleJSON = JSON.parse(JSON.stringify(sampleJSON));
            
            let catgTwoLen = 0;
            let catgThreeLen = 0;
            let catgTwoSum = 0;
            let catgThreeSum = 0;
            let catgTwoAvg = 0;
            let catgThreeAvg = 0;
            let tempCatg = "";
            let catgOneLen = 0;
            for(var hexitr=0;hexitr<hexMap.length;hexitr++){
                catgOneLen = sampleJSON['children'].length
                for(var catgoneItr = 0;catgoneItr<catgOneLen;catgoneItr++){
                    if(sampleJSON['children'][catgoneItr].name == hexMap[hexitr].catgOne){
                        catgTwoLen = sampleJSON['children'][catgoneItr]['children'].length;
                        catgThreeLen = 0;
                        catgThreeSum = 0;
                        for(var catgtwoItr = 0;catgtwoItr<catgTwoLen;catgtwoItr++){
                            if(sampleJSON['children'][catgoneItr]['children'][catgtwoItr] !== undefined){
                                if(sampleJSON['children'][catgoneItr]['children'][catgtwoItr].name == hexMap[hexitr].catgTwo){
                                    sampleJSON['children'][catgoneItr]['children'][catgtwoItr]['children'].push({
                                        "name":hexMap[hexitr].catgThree,
                                        "size":hexMap[hexitr].val
                                    });
                                }
                            }
                        }
                    }
                }
            }
            
            date_ob = new Date();
            hours = date_ob.getHours();
            minutes = date_ob.getMinutes();
            seconds = date_ob.getSeconds();
            console.log("after json creation: "+hours + ":" + minutes+":"+seconds);
            
            var newJson = [];
            let namecatgThree;
            let tempSumThree = 0;
            let tempSum = 0;
            catgOneLen = sampleJSON['children'].length;
            console.log("catgOne Len: "+catgOneLen);
            for(var catgoneItr = 0;catgoneItr<catgOneLen;catgoneItr++){
                catgTwoLen = sampleJSON['children'][catgoneItr]['children'].length;
                console.log("catgTwoLen: "+catgTwoLen);
                catgTwoSum = 0;
                catgTwoAvg = 0;
                tempSum = 0;
                console.log("Catg One name -------------------------------------------------------------"+sampleJSON['children'][catgoneItr].name);
                for(var catgtwoItr = 0;catgtwoItr<catgTwoLen;catgtwoItr++){
                    catgThreeLen = sampleJSON['children'][catgoneItr]['children'][catgtwoItr]['children'].length;
                    catgThreeSum = 0;
                    catgThreeAvg = 0;
                    tempSumThree = 0;
                    console.log("Catg two name ---------"+sampleJSON['children'][catgoneItr]['children'][catgtwoItr].name);
                    console.log("Catg three len ---------"+catgThreeLen);
                    for(let catgthreeItr = 0;catgthreeItr<catgThreeLen;catgthreeItr++){
                        tempSumThree =  parseFloat(sampleJSON['children'][catgoneItr]['children'][catgtwoItr]['children'][catgthreeItr].size);
                        tempSumThree = tempSumThree.toFixed(2);
                        catgThreeSum = parseFloat(parseFloat(catgThreeSum) + parseFloat(tempSumThree));
                        // console.log("Catg three name ---------"+sampleJSON['children'][catgoneItr]['children'][catgtwoItr]['children'][catgthreeItr].name);
                        // console.log("Catg three sum ---------"+catgThreeSum);
                    }
                    
                    catgThreeAvg = parseFloat(parseFloat(catgThreeSum)/parseFloat(catgThreeLen));
                    catgThreeAvg = catgThreeAvg.toFixed(2);
                    console.log("catg 3 avg "+catgThreeAvg);
                    sampleJSON['children'][catgoneItr]['children'][catgtwoItr].size = parseFloat(catgThreeAvg);
                    tempSum = parseFloat(sampleJSON['children'][catgoneItr]['children'][catgtwoItr].size)
                    tempSum = tempSum.toFixed(2);
                    catgTwoSum = parseFloat(parseFloat(catgTwoSum) +parseFloat(tempSum));
                    catgTwoSum = catgTwoSum.toFixed(2);

                    sampleJSON['children'][catgoneItr]['children'][catgtwoItr]['children'] = sampleJSON['children'][catgoneItr]['children'][catgtwoItr]['children'].sort(function IHaveAName(a, b) { 
                        return a.size > b.size ?  1 
                        : a.size < b.size ? -1 
                        : 0;                   
                    });
                }
                
                console.log("catg two: sum "+catgTwoSum)
                console.log("catg two: catgTwoLen "+catgTwoLen)
                catgTwoAvg = parseFloat(catgTwoSum)/parseFloat(catgTwoLen);
                catgTwoAvg = catgTwoAvg.toFixed(2)
                console.log("catg two: catgTwoAvg "+catgTwoAvg)
                console.log("----------------");
                console.log("----------------");
                sampleJSON['children'][catgoneItr].size = parseFloat(catgTwoAvg);

                sampleJSON['children'][catgoneItr]['children'] = sampleJSON['children'][catgoneItr]['children'].sort(function IHaveAName(a, b) {
                    return a.size > b.size ?  1 
                    : a.size < b.size ? -1 
                    : 0;                   
                });
            }
            
            sampleJSON['children'] = sampleJSON['children'].sort(function IHaveAName(a, b) {
                return a.size > b.size ?  1 
                : a.size < b.size ? -1 
                : 0;                   
            });
            
            // catgOneLen = sampleJSON['children'].length;
            // console.log("catgOne Len: "+catgOneLen);
            // for(var catgoneItr = 0;catgoneItr<catgOneLen;catgoneItr++){
            //     catgTwoLen = sampleJSON['children'][catgoneItr]['children'].length;
            //     for(var catgtwoItr = 0;catgtwoItr<catgTwoLen;catgtwoItr++){

            //         sampleJSON['children'][catgoneItr]['children'][catgtwoItr]['children'] = sampleJSON['children'][catgoneItr]['children'][catgtwoItr]['children'].sort(function IHaveAName(a, b) { // non-anonymous as you ordered...
            //             return a.size > b.size ?  1 
            //             : a.size < b.size ? -1 
            //             : 0;                   
            //         });

            //         // sampleJSON['children'][catgoneItr]['children'][catgtwoItr]['children'] = Object.keys(sampleJSON['children'][catgoneItr]['children'][catgtwoItr]['children']).sort().reduce(
            //         //     (obj, key) => { 
            //         //       obj[key] = sampleJSON['children'][catgoneItr]['children'][catgtwoItr]['children'][key]; 
            //         //       return obj;
            //         //     }, 
            //         //     {}
            //         //   );


            //     }
            //     sampleJSON['children'][catgoneItr]['children'] = sampleJSON['children'][catgoneItr]['children'].sort(function IHaveAName(a, b) { // non-anonymous as you ordered...
            //         return a.size > b.size ?  1 
            //         : a.size < b.size ? -1 
            //         : 0;                   
            //     });
            // }
            
            date_ob = new Date();
            hours = date_ob.getHours();
            minutes = date_ob.getMinutes();
            seconds = date_ob.getSeconds();
            console.log("after size attach in json: "+hours + ":" + minutes+":"+seconds);                                
            return res.status(200).json(sampleJSON);
            
            default:
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    }
    
    export default handler;
