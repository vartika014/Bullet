import { useCallback, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ThemeProvider } from "@/components/theme";
import { useToast } from "@/components/toast";
import { GenreScreen } from "@/screens/GenreScreen";
import { ReelsScreen } from "@/screens/ReelsScreen";
import { PaywallScreen } from "@/screens/PaywallScreen";
import { PaymentApp } from "@/screens/PaymentApp";
import { LibraryScreen } from "@/screens/LibraryScreen";
import { DramaSheet } from "@/screens/DramaSheet";
import { PlayerOverlay } from "@/screens/PlayerOverlay";
import { TRIAL_PRICE, money } from "@/lib/data";

/**
 * Client-side state routing:
 *   genres -> reels -> paywall -> (pay) -> library
 *                        └─ back arrow ───────┘
 */
function Screens() {
  const toast = useToast();
  const [screen, setScreen] = useState("genres");
  const [genres, setGenres] = useState([]);
  const [method, setMethod] = useState("card");
  const [trial, setTrial] = useState(false);
  const [myList, setMyList] = useState(() => new Set());
  const [sheet, setSheet] = useState(null);
  const [player, setPlayer] = useState(null); // { drama, ep }

  const toPaywall = useCallback(() => setScreen("paywall"), []);
  const paid = useCallback(() => {
    setTrial(true);
    setScreen("library");
    toast(`Trial started · ${money(TRIAL_PRICE)} paid. Every episode is unlocked.`, "success");
  }, [toast]);

  const toggleSave = (d) => {
    const has = myList.has(d.id);
    setMyList((s) => {
      const n = new Set(s);
      has ? n.delete(d.id) : n.add(d.id);
      return n;
    });
    toast(has ? `Removed ${d.title} from My List` : `Added ${d.title} to My List`, has ? "info" : "success");
  };

  const openPaywallFromLibrary = () => {
    setPlayer(null);
    setSheet(null);
    setScreen("paywall");
  };

  const play = (drama, ep) => {
    setSheet(null);
    setPlayer({ drama, ep });
  };

  return (
    <div key={screen} className="h-full">
      {screen === "genres" && <GenreScreen selected={genres} setSelected={setGenres} onProceed={() => setScreen("reels")} />}
      {screen === "reels" && <ReelsScreen genres={genres} onDone={toPaywall} />}
      {screen === "paywall" && (
        <PaywallScreen method={method} onMethodChange={setMethod} onBack={() => setScreen("library")} onStart={() => setScreen("pay")} />
      )}
      {screen === "pay" && <PaymentApp method={method} onCancel={() => setScreen("paywall")} onSuccess={paid} />}
      {screen === "library" && (
        <LibraryScreen
          genres={genres}
          trial={trial}
          myList={myList}
          onOpen={setSheet}
          onToggleSave={toggleSave}
          onGoPremium={openPaywallFromLibrary}
          onPlay={play}
        />
      )}

      {screen === "library" && (
        <DramaSheet
          drama={sheet}
          trial={trial}
          saved={sheet ? myList.has(sheet.id) : false}
          onClose={() => setSheet(null)}
          onToggleSave={toggleSave}
          onPlay={play}
          onLocked={openPaywallFromLibrary}
        />
      )}
      {screen === "library" && player && (
        <PlayerOverlay
          key={`${player.drama.id}-${player.ep}`}
          drama={player.drama}
          ep={player.ep}
          trial={trial}
          onEpisode={(n) => setPlayer({ drama: player.drama, ep: n })}
          onClose={() => setPlayer(null)}
          onLocked={openPaywallFromLibrary}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PhoneFrame>
        <Screens />
      </PhoneFrame>
    </ThemeProvider>
  );
}
