import { useI18n } from '../../i18n/i18n.jsx';

export default function LangSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <select
      className="lang-switcher"
      value={lang}
      onChange={e => setLang(e.target.value)}
      aria-label="Language"
    >
      <option value="en">EN</option>
      <option value="hi">हिं</option>
    </select>
  );
}
