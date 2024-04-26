export function checkRequiredField(fields:any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pour vérifier le format de l'email
    for(let i = 0; i < fields.length; i++) {
        let field = fields[i];
        if(typeof field === 'object' && field.type === 'mail') { // Si le champ est un objet de type 'mail'
            if(!field.object || !emailRegex.test(field.object)) { // Vérifie si l'email est null, undefined, '' ou non conforme au format
                return false;
            }
        } else { // Si le champ n'est pas un objet de type 'mail'
            if(!field) { // Vérifie si le champ est null, undefined ou ''
                return false;
            }
        }
    }
    return true;
}
