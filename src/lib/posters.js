// Real key art for the Screen 1 poster wall (cropped to 3:5, white gutters removed).
import adulting from "@/assets/posters/adulting-sort-of.webp";
import nextDoor from "@/assets/posters/next-door.webp";
import piecesOfUs from "@/assets/posters/pieces-of-us.webp";
import stillMe from "@/assets/posters/still-me.webp";
import billionaire from "@/assets/posters/billionaires-mistake.webp";
import lastText from "@/assets/posters/the-last-text.webp";
import turningPoint from "@/assets/posters/the-turning-point.webp";
import theNextDoor from "@/assets/posters/the-next-door.webp";

const P = {
  adulting: { title: "Adulting (sort of)", src: adulting },
  nextDoor: { title: "Next Door", src: nextDoor },
  piecesOfUs: { title: "Pieces of Us", src: piecesOfUs },
  stillMe: { title: "Still Me", src: stillMe },
  billionaire: { title: "The Billionaire's Mistake", src: billionaire },
  lastText: { title: "The Last Text", src: lastText },
  turningPoint: { title: "The Turning Point", src: turningPoint },
  theNextDoor: { title: "The Next Door", src: theNextDoor },
};

export const WALL_TOP = [P.adulting, P.nextDoor, P.piecesOfUs, P.stillMe, P.billionaire];
export const WALL_BOTTOM = [P.lastText, P.turningPoint, P.theNextDoor, P.piecesOfUs, P.adulting];
