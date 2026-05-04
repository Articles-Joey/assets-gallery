

const artAdjectives = [
    'Vivid', 'Abstract', 'Surreal', 'Bold', 'Elegant', 'Expressive', 'Minimal', 'Dynamic',
    'Colorful', 'Monochrome', 'Textured', 'Fluid', 'Geometric', 'Dreamy', 'Luminous', 'Playful',
    'Whimsical', 'Modern', 'Classic', 'Impressionist', 'Cubist', 'Dramatic', 'Soft', 'Radiant',
    'Muted', 'Intricate', 'Organic', 'Graphic', 'Retro', 'Futurist'
];

const artNouns = [
    'Canvas', 'Palette', 'Brush', 'Muse', 'Gallery', 'Easel', 'Sketch', 'Portrait',
    'Sculptor', 'Painter', 'Graffiti', 'Mural', 'Collage', 'Frame', 'Stencil', 'Ink',
    'Charcoal', 'Pastel', 'Acrylic', 'Watercolor', 'Oil', 'Print', 'Exhibit', 'Critique',
    'Studio', 'Gallery', 'Curator', 'Model', 'StillLife', 'Masterpiece',
    // Famous art names
    'MonaLisa', 'StarryNight', 'TheScream', 'Guernica', 'GirlWithAPearlEarring',
    'ThePersistenceOfMemory', 'TheKiss', 'TheBirthOfVenus', 'AmericanGothic',
    'TheLastSupper', 'TheCreationOfAdam', 'TheNightWatch', 'LasMeninas',
    'TheGreatWave', 'CampbellsSoup', 'Nighthawks', 'WaterLilies', 'Sunflowers',
    'WhistlersMother', 'LibertyLeadingThePeople', 'TheSonOfMan', 'ImpressionSunrise'
];



/**
 * Generates a random art-themed nickname.
 * @returns {string} A random nickname like "VividCanvas" or "AbstractMuse".
 */
const generateRandomNickname = () => {
    const adj = artAdjectives[Math.floor(Math.random() * artAdjectives.length)];
    const noun = artNouns[Math.floor(Math.random() * artNouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}${num}`;
};

export default generateRandomNickname;