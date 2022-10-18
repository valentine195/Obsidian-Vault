let start = new Date("January 1, 2021");
const fs = require("fs");

const build = async () => {
    for (let i = 1; i < 365; i++) {
        const date = new Date(start.valueOf() + 24 * 60 * 60 * 1000 * i);
        fs.writeFileSync(
            `./${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.md`,
            ""
        );
    }
};

build();
