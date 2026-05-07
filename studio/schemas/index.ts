import { artist } from "./artist";
import { exhibition } from "./exhibition";
import { homePicks } from "./homePicks";
import { illustration } from "./illustration";
import { photographSet } from "./photographSet";
import { project } from "./project";
import { writing } from "./writing";

import { cvRow } from "./objects/cvRow";
import { imageWithAlt } from "./objects/imageWithAlt";
import { portableText } from "./objects/portableText";

export const schemaTypes = [
  // Singletons (one of each, ever)
  artist,
  homePicks,

  // Many-of
  project,
  exhibition,
  illustration,
  photographSet,
  writing,

  // Reusable objects
  imageWithAlt,
  cvRow,
  portableText,
];
