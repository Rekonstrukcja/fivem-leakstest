document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const convertButton = document.getElementById('convert-button');

    convertButton.addEventListener('click', function() {
        const inputValue = input.value.trim();
        const lines = inputValue.split('\n');
        let result = '';

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith("TriggerServerEvent")) {
                const match = line.match(/TriggerServerEvent\('([^']+)',\s*(.*)\)/);
                if (match) {
                    const eventName = match[1];
                    const params = match[2];
                    result += `'${eventName}'\n[${params}]\n\n`;
                } else {
                    result += line + '\n';
                }
            } else if (line.startsWith("'") && line.includes('[')) {
                const eventName = line.split('\n')[0].replace(/'/g, '').trim();
                const params = line.split('\n')[1].replace(/[\[\]]/g, '').trim();
                result += `TriggerServerEvent('${eventName}', ${params})\n\n`;
            } else {
                result += line + '\n';
            }
        });

        output.value = result.trim();
    });
});
