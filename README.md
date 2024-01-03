# csv-to-sql-insert

Provide table data as a CSV ([comma-separated values](https://en.wikipedia.org/wiki/Comma-separated_values)) file and output a SQL insert statement for a table with the same name as the file.

## Usage ⚙

1. Confirm you have a directory named `csv`
2. Save your input CSV file in the `csv` directory
3. In a terminal window, first run `npm install` to install dependencies and then run `npm start`

    - **Question 1**: Enter your CSV file name:
    - You have enter your file name like `ExampleTable` (**without file extension**)
    - **Question 2**: Destination name(file):
    - Just put your output file name like `mysql` or `post` or `table` etc (**without file extension**)

4. Watch the terminal window for any error messages
5. Your SQL insert statement will be saved in `sql/YourFileName.sql`

## `MAC & LINUX` USER ⚙

If you are using Mac or Linux then have a very good opportunity to handle all of these very easily.
**To run your program just execute the below command**

```bash
sudo bash start.sh
```

-   Enter your CSV filename
-   Enter your destination file name

## Support 👨‍💻

-   [Create an Issue](https://github.com/gitdagray/csv-to-sql/issues)
-   [X: @yesdavidgray](https://x.com/yesdavidgray)

## Contributing 🛠

Please read [CONTRIBUTING.md](https://github.com/gitdagray/csv-to-sql/blob/main/CONTRIBUTING.md) prior to contributing.

## Code of Conduct

Please see [CODE_OF_CONDUCT.md](https://github.com/gitdagray/csv-to-sql/blob/main/CODE_OF_CONDUCT.md).
