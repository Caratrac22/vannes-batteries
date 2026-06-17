"use server";

const WEB3FORMS_KEY = "059c28d6-4dc0-4cb5-ab89-0454b9048faa";

export interface FormState {
  status: "idle" | "success" | "error";
  message: string;
}

export async function submitContactForm(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const prenom = formData.get("prenom") as string;
  const nom = formData.get("nom") as string;
  const email = formData.get("email") as string;
  const telephone = (formData.get("telephone") as string) || "Non renseigné";
  const objet = formData.get("objet") as string;
  const message = formData.get("message") as string;
  const rgpd = formData.get("rgpd") as string;

  if (!prenom || !nom || !email || !objet || !message || !rgpd) {
    return { status: "error", message: "Veuillez remplir tous les champs obligatoires." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Adresse email invalide." };
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Nouveau message - VANNES BATTERIES: ${objet}`,
        from_name: `${prenom} ${nom}`,
        name: `${prenom} ${nom}`,
        email,
        replyto: email,
        telephone,
        message: `Prénom : ${prenom}\nNom : ${nom}\nEmail : ${email}\nTéléphone : ${telephone}\nObjet : ${objet}\n\n${message}`,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return { status: "success", message: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais." };
    }

    return { status: "error", message: result.message || "Une erreur est survenue." };
  } catch {
    return { status: "error", message: "Impossible de se connecter au serveur." };
  }
}
