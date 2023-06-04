// Створюємо клас MetricsAnalyst
class MetricsAnalyst {
    constructor() {
        this.linesList = []; // Поле для зберігання рядків коду
    }

    // Отримуємо речення з файлу або каталогу
    getSentencesFromDirectory(dirPath, fileType, slash = '/') {
        const filePaths = require('fs').readdirSync(dirPath); // Отримуємо список файлів у каталозі
        let fileCounter = 0; // Лічильник файлів

        // Проходимося по кожному файлу
        for (const filePath of filePaths) {
            let toExit = false;
            let fileTypeIndex = fileType.length - 1;

            // Перевіряємо, чи відповідає тип файлу заданому розширенню
            for (let i = filePath.length - 1; i >= 0; i--) {
                if (filePath[i] !== fileType[fileTypeIndex]) {
                    toExit = true;
                    break;
                }

                if (fileTypeIndex === 0) {
                    break;
                }
                fileTypeIndex--;
            }

            if (!toExit) {
                this.getSentencesFromOneFile(dirPath + slash + filePath); // Отримуємо речення з файлу
                console.log("File name to handle: " + filePath); // Виводимо назву файлу для обробки
                fileCounter++;
            }
        }

        return fileCounter; // Повертаємо кількість оброблених файлів
    }

    // Отримуємо речення з одного файлу
    getSentencesFromOneFile(filePath) {
        const fs = require('fs');
        const fileLines = fs.readFileSync(filePath, 'utf8').split('\n'); // Отримуємо рядки коду з файлу
        this.linesList.push(...fileLines); // Додаємо рядки коду до списку
    }

    // Створюємо файл з рядками коду
    createLinesFile(filePath) {
        const fs = require('fs');
        const file = fs.createWriteStream(filePath, {flags: 'a'});

        for (const line of this.linesList) {
            file.write(line + '\n'); // Записуємо рядки коду в файл
        }

        file.end();
    }

    // Отримуємо кількість рядків коду
    getLinesOfCode() {
        return this.linesList.length;
    }

    // Отримуємо кількість порожніх рядків коду
    getBlankLinesOfCode() {
        let blankLinesCounter = 0;

        for (const line of this.linesList) {
            if (!line.trim()) {
                blankLinesCounter++;
            }
        }

        return blankLinesCounter;
    }

    // Отримуємо кількість рядків коду, що містять коментарі
    getCommentsLinesOfCode() {
        let commentsLinesCounter = 0;
        let isComment = false;

        for (const line of this.linesList) {
            for (let i = 0; i < line.length; i++) {
                if (line[i] === '/' && !isComment) {
                    if (line[i + 1] === '/') {
                        commentsLinesCounter++;
                        break;
                    } else if (line[i + 1] === '*') {
                        commentsLinesCounter++;
                        i++;
                        isComment = true;
                        continue;
                    }
                }

                if (isComment && i === 0) {
                    commentsLinesCounter++;
                }

                if (line[i] === '*' && line[i + 1] === '/') {
                    isComment = false;
                    i++;
                }
            }
        }

        return commentsLinesCounter;
    }

    // Отримуємо кількість рядків коду з ключовими словами
    getLogicalLinesOfCodeKeywords() {
        let counterLoc = 0;
        const keywords = [
            "if", "else", "for", "while", "switch", "break", "return", "goto", "continue", "exit", "throw", "try",
            "catch", "finally", "(", ";", "#"
        ];

        for (const line of this.linesList) {
            for (const keyword of keywords) {
                if (line.includes(keyword)) {
                    counterLoc++;
                    break;
                }
            }
        }

        return counterLoc;
    }
}

const ma = new MetricsAnalyst(); // Створюємо об'єкт класу MetricsAnalyst

const fileCounter = ma.getSentencesFromDirectory("C:/Users/HP/Desktop/metrics-analyst/file", ".js", "\\"); // Отримуємо кількість оброблених файлів
console.log("Amount of files to handle: " + fileCounter); // Виводимо кількість файлів для обробки
let loc = ma.getLinesOfCode(); // Отримуємо кількість рядків коду
console.log("LOC: " + loc); // Виводимо кількість рядків коду

console.log("Blank LOC: " + ma.getBlankLinesOfCode()); // Виводимо кількість порожніх рядків коду

let cloc = ma.getCommentsLinesOfCode(); // Отримуємо кількість рядків коду з коментарями

console.log("CLOC: " + cloc); // Виводимо кількість рядків коду з коментарями
console.log("Level of commentary usage: " + cloc / loc); // Виводимо рівень використання коментарів

console.log("Logical LOC: " + ma.getLogicalLinesOfCodeKeywords()); // Виводимо кількість рядків коду з ключовими словами
