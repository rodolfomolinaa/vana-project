# Vana Banguat Project

Create a RESTful service to query Banguats currency exchange rate.

## Requirements

You will only need Node.js and a node global package, npm, installed in your environement.

## Installation

Clone the repository and install dependencies using

```bash
npm install
```

## Usage

Running **npm run dev** command will start server at port **3000**

There are define two endpoints:

-   /api/date-currency => this endpoint receives two parameters which are **date** in YYYY-MM-DD format and **currency** which must be **USD** or **EU**

-   /api/date-range-currency => this endpoint receives three parameters which are **start_date**, **end_date** and **currency** that are define with the same rules as date-currency

**Note:** For date-currency endpoint **the date must be any day between 2015 and today**

## License

[MIT](https://choosealicense.com/licenses/mit/)
