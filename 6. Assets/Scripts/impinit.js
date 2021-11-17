class ImprovedInitiative {
    target = "https://www.improved-initiative.com/launchencounter/";
    launch(...monsters) {
        const data = monsters.map((m) => {
            return { Name: m };
        });
        const combatants = { Combatants: data };
        const form = createEl("form");

        form.setAttribute("method", "post");
        form.setAttribute("action", this.target);

        Object.keys(combatants).forEach(function (key) {
            var textarea = createEl("input");
            textarea.setAttribute("type", "hidden");
            textarea.setAttribute("name", key);
            textarea.setAttribute("value", JSON.stringify(combatants[key]));

            form.appendChild(textarea);
        });

        document.body.appendChild(form);
        
        form.submit();
        form.detach();
    }
}
