"use client";

import { useActionState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import SocialLinks from "@/components/ui/SocialLinks";
import ShopStatus from "@/components/ui/ShopStatus";
import MapSection from "@/components/sections/MapSection";
import { submitContactForm, type FormState } from "./actions";

const initialState: FormState = { status: "idle", message: "" };

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  return (
    <>
      {/* ── Page Header ───────────────────────────────────── */}
      <section className="bg-dark-950 pt-32 pb-16 relative overflow-hidden">
        <div className="gradient-overlay absolute inset-0 opacity-50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-rajdhani font-bold uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl text-white mb-6">
            CONTACTEZ-NOUS
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
            Besoin de renseignements ? N'hésitez pas à nous contacter par téléphone ou par e-mail.
            <br />
            Nos horaires : lun–ven 8h30–18h30, sam 9h–12h.
          </p>
        </div>
      </section>

      {/* ── Contact Layout ────────────────────────────────── */}
      <section className="bg-light-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24">
            
            {/* ── Left Column: Contact Info ─────────────────── */}
            <div className="space-y-12 animate-fade-in-up">
              {/* Address */}
              <div>
                <h3 className="flex items-center gap-2 font-rajdhani font-bold text-xl uppercase tracking-wide text-dark-950 mb-4">
                  <MapPin className="w-6 h-6 text-orange" />
                  Notre Magasin
                </h3>
                <p className="text-dark-700 leading-relaxed mb-4">
                  19 rue Denis Papin, Z.A. de Kerniol<br />
                  56000 Vannes
                </p>
                <div className="mb-4">
                  <ShopStatus />
                </div>
                <div className="flex flex-wrap gap-4">
                  <a href="https://maps.app.goo.gl/9UDu2AUPtbS4d1au7" target="_blank" rel="noopener noreferrer" className="btn-primary !py-3 !px-4 text-xs">
                    Google Maps
                  </a>
                  <a href="https://waze.com/ul/hgbqp0zwpc" target="_blank" rel="noopener noreferrer" className="btn-secondary !py-3 !px-4 text-xs">
                    Waze
                  </a>
                </div>
              </div>

              {/* Direct Contact */}
              <div>
                <h3 className="font-rajdhani font-bold text-xl uppercase tracking-wide text-dark-950 mb-4">
                  Contact Direct
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a href="tel:+33297492019" className="flex items-center gap-3 text-dark-700 hover:text-orange transition-colors">
                      <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-orange" />
                      </div>
                      <span className="font-medium text-lg">02 97 49 20 19</span>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:batterie56@hotmail.com" className="flex items-center gap-3 text-dark-700 hover:text-orange transition-colors">
                      <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-orange" />
                      </div>
                      <span className="font-medium text-lg">batterie56@hotmail.com</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Opening Hours */}
              <div>
                <h3 className="flex items-center gap-2 font-rajdhani font-bold text-xl uppercase tracking-wide text-dark-950 mb-4">
                  <Clock className="w-6 h-6 text-orange" />
                  Horaires d'ouverture
                </h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm text-dark-700">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-orange/5 transition-colors">
                        <th className="font-medium px-4 py-3">Lun – Ven</th>
                        <td className="px-4 py-3 text-right">08h30–12h00 / 14h00–18h30</td>
                      </tr>
                      <tr className="hover:bg-orange/5 transition-colors">
                        <th className="font-medium px-4 py-3">Samedi</th>
                        <td className="px-4 py-3 text-right">09h00–12h00</td>
                      </tr>
                      <tr className="bg-gray-50 text-muted">
                        <th className="font-medium px-4 py-3">Dimanche</th>
                        <td className="px-4 py-3 text-right">Fermé</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Socials */}
              <div>
                <h3 className="font-rajdhani font-bold text-xl uppercase tracking-wide text-dark-950 mb-4">
                  Suivez-nous
                </h3>
                <div className="text-dark-700 [&>div>a]:bg-gray-100 [&>div>a]:border-gray-200 [&>div>a]:text-dark-700">
                  <SocialLinks />
                </div>
              </div>
            </div>

            {/* ── Right Column: Form (Server Action) ────────── */}
            <div className="animate-fade-in-up">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
                <h3 className="font-rajdhani font-bold text-2xl uppercase tracking-wide text-dark-950 mb-8">
                  Envoyez-nous un message
                </h3>

                <form action={formAction} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <input type="text" name="prenom" id="prenom" required
                        className="block w-full px-4 py-3 pt-6 text-sm text-dark-950 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange peer transition-all"
                        placeholder=" " />
                      <label htmlFor="prenom" className="absolute text-sm text-muted duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                        Prénom *
                      </label>
                    </div>
                    <div className="relative group">
                      <input type="text" name="nom" id="nom" required
                        className="block w-full px-4 py-3 pt-6 text-sm text-dark-950 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange peer transition-all"
                        placeholder=" " />
                      <label htmlFor="nom" className="absolute text-sm text-muted duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                        Nom *
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <input type="email" name="email" id="email" required
                        className="block w-full px-4 py-3 pt-6 text-sm text-dark-950 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange peer transition-all"
                        placeholder=" " />
                      <label htmlFor="email" className="absolute text-sm text-muted duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                        Email *
                      </label>
                    </div>
                    <div className="relative group">
                      <input type="tel" name="telephone" id="telephone"
                        className="block w-full px-4 py-3 pt-6 text-sm text-dark-950 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange peer transition-all"
                        placeholder=" " />
                      <label htmlFor="telephone" className="absolute text-sm text-muted duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                        Téléphone
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <select name="objet" id="objet" required defaultValue=""
                      className="block w-full px-4 py-3 text-sm text-dark-950 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-all">
                      <option value="" disabled>Objet de votre demande *</option>
                      <option value="Demande de devis">Demande de devis</option>
                      <option value="Renseignements produit">Renseignements produit</option>
                      <option value="Demande de devis professionnel">Demande de devis professionnel</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div className="relative group">
                    <textarea name="message" id="message" required rows={5}
                      className="block w-full px-4 py-3 pt-6 text-sm text-dark-950 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange peer transition-all resize-none"
                      placeholder=" "></textarea>
                    <label htmlFor="message" className="absolute text-sm text-muted duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                      Message *
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="rgpd" name="rgpd" required
                      className="mt-1 w-4 h-4 text-orange border-gray-300 rounded focus:ring-orange" />
                    <label htmlFor="rgpd" className="text-xs text-muted leading-relaxed">
                      J'accepte que les informations saisies soient exploitées dans le cadre de ma demande et de la relation commerciale qui peut en découler.*
                    </label>
                  </div>

                  {/* Form Status Messages */}
                  {state.status === "success" && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      {state.message}
                    </div>
                  )}
                  {state.status === "error" && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {state.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full btn-primary !py-4"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      <MapSection />
    </>
  );
}
