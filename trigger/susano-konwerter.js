document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const convertButton = document.getElementById('convert-button');

    convertButton.addEventListener('click', function () {
        const inputValue = input.value.trim();
        const lines = inputValue.split('\n');
        let result = [];
        let insideThread = false;

        lines.forEach(line => {
            let trimmedLine = line.trim();

            if (trimmedLine.startsWith("Citizen.CreateThread")) {
                insideThread = true;
            }

            if (trimmedLine.includes("TriggerServerEvent")) {
                const match = trimmedLine.match(/TriggerServerEvent\('([^']+)'\s*(?:,\s*(.*))?\)/);
                if (match) {
                    const eventName = match[1];
                    const params = match[2] ? match[2].trim() : '';

                    // Konwersja do formatu Susano
                    result.push(`'${eventName}'`);
                    result.push(`[${params}]`);
                } else {
                    result.push(trimmedLine);
                }
            } else if (trimmedLine.startsWith("'") && lines[lines.indexOf(line) + 1]?.includes('[')) {
                const eventName = trimmedLine.replace(/'/g, '').trim();
                const params = lines[lines.indexOf(line) + 1].replace(/[\[\]]/g, '').trim();

                // Konwersja z powrotem na Red
                result.push(`TriggerServerEvent('${eventName}', ${params})`);
            } else {
                result.push(trimmedLine);
            }

            if (insideThread && trimmedLine === "end)") {
                insideThread = false;
            }
        });

        output.value = result.join('\n');
    });
});
