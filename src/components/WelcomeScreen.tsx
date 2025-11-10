import { useTranslation } from "react-i18next"

export function WelcomeScreen() {
  const { t } = useTranslation()
  return (
    <div className="max-w-[800px] w-full mx-auto flex items-center justify-center flex-col gap-4 mb-16">
      <img src="/favicon.svg" alt="Logo" className="size-16" />
      <h1 className="text-2xl font-bold">{t("app.welcome")}</h1>
      <p className="text-muted-foreground text-center text-pretty">{t("app.welcomeDescription")}</p>
    </div>
  )
}
