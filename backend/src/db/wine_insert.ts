import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { languageTable, rangeTable, wineTable, wineTranslationTable } from './schema.js'
import { eq } from 'drizzle-orm'
import { selectOnlyOne } from './utils/select.js'

const db = drizzle(process.env.DATABASE_URL!)

async function insertRange() {
  console.log('🍇 Inserting range data...')

  await db.insert(rangeTable).values([
    {
      slug: 'pierreries',
      name: 'Les Pierreries',
      description: 'Les vins de cette gamme sont issus de vignobles en bas de coteaux et en plaine. Ils révèlent la typicité de chacun des sept cépages Alsacien. Aromatiques et expressifs, ce sont des vins appréciés pour leur fraîcheur, leur équilibre et leurs saveurs.'
    },
    {
      slug: 'pierres_precieuses',
      name: 'Les Pierres Précieuses',
      description: 'Issus de nos précieux terroirs et nos vieilles vignes magnifiées par le temps, les vins de cette gamme vous offriront une plus grande profondeur. Charpenté mais subtil, leur bouquet vous étonnera par son intensité et sa finesse.'
    },
    {
      slug: 'grands_crus',
      name: 'Les Grands Crus',
      description: 'À Eguisheim, les meilleures parcelles ont été sélectionnées pour élaborer les Grands Crus. On y trouve le Eichberg et le Pfersigberg. Véritable terres d’excellence, on y produit des vins au caractère incomparable qui reflètent la richesse et l’authenticité de nos terroirs.'
    },
    {
      slug: 'vendanges_tardives',
      name: 'Les Vendanges Tardives',
      description: 'Saint parmi les Saints, les vendanges tardives sont élaborés à partir de raisins atteint de pourriture noble (appelée aussi botrytis). Un tri sérieux et rigoureux sera à l’essence même de ces nectars, rares et complexes. Aux arômes de fruits confits, ces vins liquoreux font partie des plus grands vins du monde.'
    }
  ])

  console.log('🍇 Range data inserted successfully!')
}

async function insertWine() {
  console.log('🍷 Inserting wine data...')

  await db.insert(wineTable).values([
    {
      slug: 'sylvaner',
      nativeName: 'Sylvaner',
      price: 10,
      rangeSlug: 'pierreries'
    },
    {
      slug: 'riesling',
      nativeName: 'Riesling',
      price: 12,
      rangeSlug: 'pierreries'
    },
    {
      slug: 'pinot_gris',
      nativeName: 'Pinot Gris',
      price: 15,
      rangeSlug: 'pierreries'
    },
    {
      slug: 'gewurztraminer',
      nativeName: 'Gewurztraminer',
      price: 12,
      rangeSlug: 'pierreries'
    },
    {
      slug: 'pinot_noir',
      nativeName: 'Pinot Noir',
      price: 10,
      rangeSlug: 'pierreries'
    },
    {
      slug: 'pinot_blanc',
      nativeName: 'Pinot Blanc',
      price: 10,
      rangeSlug: 'pierreries'
    },
    {
      slug: 'muscat',
      nativeName: 'Muscat',
      price: 15,
      rangeSlug: 'pierreries'
    },
    {
      slug: 'cremant_d_alsace',
      nativeName: 'Crémant d\'Alsace',
      price: 20,
      rangeSlug: 'pierreries'
    }
  ])

  await db.insert(wineTable).values([
    {
      slug: 'riesling_emeraude',
      nativeName: 'Riesling Émeraude',
      price: 20,
      rangeSlug: 'pierres_precieuses'
    },
    {
      slug: 'pinot_gris_saphir',
      nativeName: 'Pinot Gris Saphir',
      price: 25,
      rangeSlug: 'pierres_precieuses'
    },
    {
      slug: 'gewurztraminer_diamant',
      nativeName: 'Gewurztraminer Diamant',
      price: 20,
      rangeSlug: 'pierres_precieuses'
    },
    {
      slug: 'pinot_noir_rubis',
      nativeName: 'Pinot Noir Rubis',
      price: 25,
      rangeSlug: 'pierres_precieuses'
    }
  ])

  await db.insert(wineTable).values([
    {
      slug: 'riesling_eichberg',
      nativeName: 'Riesling Eichberg',
      price: 30,
      rangeSlug: 'grands_crus'
    },
    {
      slug: 'pinot_gris_eichberg',
      nativeName: 'Pinot Gris Eichberg',
      price: 35,
      rangeSlug: 'grands_crus'
    },
    {
      slug: 'gewurztraminer_pfersigberg',
      nativeName: 'Gewurztraminer Pfersigberg',
      price: 30,
      rangeSlug: 'grands_crus'
    }
  ])

  await db.insert(wineTable).values([
    {
      slug: 'gewurztraminer_vendanges_tardives',
      nativeName: 'Gewurztraminer Vendanges Tardives',
      price: 50,
      rangeSlug: 'vendanges_tardives'
    },
    {
      slug: 'pinot_gris_vendanges_tardives',
      nativeName: 'Pinot Gris Vendanges Tardives',
      price: 55,
      rangeSlug: 'vendanges_tardives'
    }
  ])

  console.log('🍷 Wine data inserted successfully!')
}


async function insertLanguage() {
  console.log('🌍 Inserting language data...')

  await db.insert(languageTable).values([
    {
      name: 'French',
      code: 'fr'
    },
    {
      name: 'English',
      code: 'en'
    },
    {
      name: 'Japanese',
      code: 'ja'
    }
  ])

  console.log('🌍 Language data inserted successfully!')
}

async function insertWineTranslation() {
  console.log('🌐 Inserting wine translation data...')

  const french_id = (await selectOnlyOne(await db.select({ id: languageTable.id }).from(languageTable).where(eq(languageTable.code, 'fr')))).id
  const english_id = (await selectOnlyOne(await db.select({ id: languageTable.id }).from(languageTable).where(eq(languageTable.code, 'en')))).id
  const japanese_id = (await selectOnlyOne(await db.select({ id: languageTable.id }).from(languageTable).where(eq(languageTable.code, 'ja')))).id

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'sylvaner',
      languageId: french_id,
      name: 'Sylvaner',
      description: 'Vin sec, facile, agréable qui libère un léger fruité associé à des arômes végétaux. C\'est un vin relativement discret, qui a un nez frais avec une structure simple.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 6 ans.',
      suggestion: 'Poissons, fruits de mer, choucroute, charcuteries, entrées.'
    },
    {
      wineSlug: 'sylvaner',
      languageId: english_id,
      name: 'Sylvaner',
      description: 'Dry, easy, pleasant wine that releases a slight fruitiness associated with vegetal aromas. It is a relatively discreet wine, which has a fresh nose with a simple structure.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 6 years.',
      suggestion: 'Fish, seafood, sauerkraut, cold cuts, starters.'
    },
    {
      wineSlug: 'sylvaner',
      languageId: japanese_id,
      name: 'シルヴァーナー',
      description: 'ドライで飲みやすく、心地よいワインで、わずかな果実味と植物的な香りが広がります。比較的控えめなワインで、フレッシュな香りとシンプルな構造を持っています。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '6年以内にお楽しみください。',
      suggestion: '魚介類、シュークルート、冷製肉料理、前菜。'
    }
  ])

  console.log('✅ Sylvaner')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'riesling',
      languageId: french_id,
      name: 'Riesling',
      description: 'Le roi des vins d\'Alsace. Le plus vif, le plus pointu des cépages. Il personnifie le côté fruité et floral avec une pointe d\'arôme minéral.\n\nDans sa jeunesse il présentera des arômes dominants de fruits, ensuite il se développera sur des notes minérales (pierre à fusil) et des arômes de fruits cuits',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 6 ans.',
      suggestion: 'Poissons, fruits de mer, choucroute, escargots, cuisses de grenouilles, coq au riesling.'
    },
    {
      wineSlug: 'riesling',
      languageId: english_id,
      name: 'Riesling',
      description: 'The king of Alsace wines. The liveliest, most pointed of the grape varieties. It embodies the fruity and floral side with a hint of mineral aroma.\n\nIn its youth it will present dominant aromas of fruit, then it will develop on mineral notes (flint) and aromas of cooked fruits.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 6 years.',
      suggestion: 'Fish, seafood, sauerkraut, snails, frogs\' legs, coq au riesling.'
    },
    {
      wineSlug: 'riesling',
      languageId: japanese_id,
      name: 'リースリング',
      description: 'アルザスワインの王様。最も活き活きとした、最も鋭いブドウ品種。フルーティーでフローラルな側面を持ち、ミネラル香がほんのり漂います。\n\n若いうちはフルーツの香りが支配的で、次第にミネラルノート（火打石）や煮詰めたフルーツの香りが広がります。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '6年以内にお楽しみください。',
      suggestion: '魚介類、シュークルート、エスカルゴ、カエルの足、リースリング風鶏肉。'
    }
  ])

  console.log('✅ Riesling')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'muscat',
      languageId: french_id,
      name: 'Muscat',
      description: 'Le plus marqué des blancs d\'Alsace, le plus aromatique. Il reproduit le plus fidèlement les arômes du fruit dont il est issu. Vin sec à la différence des muscats méridionaux. C\'est un merveilleux vin d\'apéritif.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 6 ans.',
      suggestion: 'Se consomme à toute heure de la journée. Se marie merveilleusement bien avec les asperges, et peut accompagner les plats relevés, style cuisine asiatique.'
    },
    {
      wineSlug: 'muscat',
      languageId: english_id,
      name: 'Muscat',
      description: 'The most marked of the Alsace whites, the most aromatic. It reproduces the aromas of the fruit from which it comes. Dry wine unlike southern muscats. It is a wonderful aperitif wine.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 6 years.',
      suggestion: 'Can be consumed at any time of the day. Pairs wonderfully with asparagus, and can accompany spicy dishes, such as Asian cuisine.'
    },
    {
      wineSlug: 'muscat',
      languageId: japanese_id,
      name: 'ミュスカ',
      description: 'アルザスの白ワインの中で最も特徴的で、最も香り高いワインです。果実の香りを最も忠実に再現しています。南部のミュスカとは異なり、ドライなワインです。素晴らしい食前酒です。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '6年以内にお楽しみください。',
      suggestion: '一日中いつでも楽しめます。アスパラガスとの相性が抜群で、アジア料理などのスパイシーな料理とも相性が良いです。'
    }
  ])

  console.log('✅ Muscat')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'pinot_noir',
      languageId: french_id,
      name: 'Pinot Noir',
      description: 'Seul cépage rouge alsacien, charmant vin d\'été. Le cépage donne au vin des arômes de fruits rouges (cerises, cassis). Il présente une belle concentration et une belle structure.\nUne robe soutenue rouge cerise, reflets violacés assez dense. Nez aromatique, aux arômes de fruits rouges et noirs. En bouche, les tanins sont mûrs, les arômes sont fruités relevés d’une pointe de sous-bois.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 6 ans.',
      suggestion: 'Viande rouge, grillade, charcuterie.'
    },
    {
      wineSlug: 'pinot_noir',
      languageId: english_id,
      name: 'Pinot Noir',
      description: 'The only Alsatian red grape variety, a charming summer wine. The grape gives the wine aromas of red fruits (cherries, blackcurrants). It has a beautiful concentration and structure.\nA deep cherry red color, with quite dense violet reflections. Aromatic nose, with aromas of red and black fruits. In the mouth, the tannins are ripe, the aromas are fruity with a hint of undergrowth.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 6 years.',
      suggestion: 'Red meat, grilled dishes, cold cuts.'
    },
    {
      wineSlug: 'pinot_noir',
      languageId: japanese_id,
      name: 'ピノ・ノワール',
      description: 'アルザスで唯一の赤ワイン用ブドウ品種で、魅力的な夏のワインです。赤い果実（さくらんぼ、カシス）の香りが漂います。美しい濃度と構造を持っています。\n濃いチェリーレッドの色合いで、紫色の反射がかなり密度があります。香り高く、赤と黒の果実の香りがします。口に含むと、タンニンは熟しており、香りは果実味があり、土の香りがほのかに漂います。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '6年以内にお楽しみください。',
      suggestion: '赤身肉、グリル料理、生ハム。'
    }
  ])

  console.log('✅ Pinot Noir')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'pinot_blanc',
      languageId: french_id,
      name: 'Pinot Blanc',
      description: 'Il produit un vin de couleur jaune, frais, vert avec des expressions au nez discrètes, délicates, rondes mais typiquement alsaciennes. Il présente un équilibre entre l\'acidité et la matière, offre des arômes de pêche, poire, pomme',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 6 ans.',
      suggestion: 'Le « Passe partout », vin pour toute occasion, accompagne à merveille les viandes légères et les terrines.'
    },
    {
      wineSlug: 'pinot_blanc',
      languageId: english_id,
      name: 'Pinot Blanc',
      description: 'It produces a yellow, fresh, green wine with discreet, delicate, round but typically Alsatian expressions on the nose. It presents a balance between acidity and matter, offering aromas of peach, pear, and apple.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 6 years.',
      suggestion: 'The "All-purpose" wine, perfect for any occasion, pairs wonderfully with light meats and terrines.'
    },
    {
      wineSlug: 'pinot_blanc',
      languageId: japanese_id,
      name: 'ピノ・ブラン',
      description: '黄色く、フレッシュで、緑がかったワインで、控えめで繊細な香りが漂い、アルザスらしい特徴を持っています。酸味とボディのバランスが良く、桃、洋梨、リンゴの香りがします。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '6年以内にお楽しみください。',
      suggestion: '「オールマイティ」なワインで、どんなシーンにもぴったり。軽い肉料理やテリーヌと相性抜群です。'
    }
  ])

  console.log('✅ Pinot Blanc')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'pinot_gris',
      languageId: french_id,
      name: 'Pinot Gris',
      description: 'Il jouit d\'une très grande complexité aromatique avec des notes de fruits confits, un côté mielleux, fumé, presque de sous-bois et une petite touche florale dans ses jeunes années.\nC\'est un vin charpenté, gras, rond, suave, persistant en bouche.\nC\'est un vin qui se garde bien, qui gagne en concentration et en bouquet.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 6 ans.',
      suggestion: 'Entrée à base de viande (tourtes, terrine), volailles, viandes blanches, baeckhaoffa (spécialité alsacienne : potée de 3 viandes), apéritif.'
    },
    {
      wineSlug: 'pinot_gris',
      languageId: english_id,
      name: 'Pinot Gris',
      description: 'It has a very great aromatic complexity with notes of candied fruits, a honeyed, smoky side, almost undergrowth and a small floral touch in its young years.\nIt is a structured, fat, round, suave wine, persistent in the mouth.\nIt is a wine that keeps well, which gains in concentration and bouquet.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 6 years.',
      suggestion: 'Meat-based starters (pies, terrines), poultry, white meats, baeckhaoffa (Alsatian specialty: stew of 3 meats), aperitif.'
    },
    {
      wineSlug: 'pinot_gris',
      languageId: japanese_id,
      name: 'ピノ・グリ',
      description: '非常に複雑な香りを持ち、コンフィチュールのような香り、ハチミツのような香り、燻製の香り、ほぼ土の香り、若い頃には花の香りが漂います。\n骨格がしっかりしていて、まろやかで、丸みがあり、口の中で持続感があります。\n熟成により、濃厚さと香りが増します。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '6年以内にお楽しみください。',
      suggestion: '肉料理の前菜（パイ、テリーヌ）、鶏肉、白身魚、ベックハッファ（アルザスの名物：3種の肉のシチュー）、食前酒。'
    }
  ])

  console.log('✅ Pinot Gris')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'gewurztraminer',
      languageId: french_id,
      name: 'Gewurztraminer',
      description: 'Vin charmeur, le plus connu des vins d\'Alsace. Il offre une véritable explosion aromatique, associée à une densité et une complexité sans commune mesure. Il présente des notes florales, plutôt portés vers la rose, des arômes fruités (coing, pamplemousse, litchi) et épicés (cannelle).\nCe vin parfumé est un vin de garde.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 6 ans.',
      suggestion: 'Apéritif, fromages (bleue, roquefort, munster) cuisines au curry et cuisines exotiques.'
    },
    {
      wineSlug: 'gewurztraminer',
      languageId: english_id,
      name: 'Gewurztraminer',
      description: 'Charming wine, the most famous of Alsace wines. It offers a real aromatic explosion, associated with a density and complexity unlike any other. It presents floral notes, rather leaning towards rose, fruity aromas (quince, grapefruit, lychee) and spicy (cinnamon).\nThis perfumed wine is a wine for keeping.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 6 years.',
      suggestion: 'Aperitif, cheeses (blue cheese, roquefort, munster), curry dishes and exotic cuisines.'
    },
    {
      wineSlug: 'gewurztraminer',
      languageId: japanese_id,
      name: 'ゲヴュルツトラミネール',
      description: '魅力的なワインで、アルザスワインの中で最も有名です。真の香りの爆発を提供し、比類のない密度と複雑さを持っています。バラのような花の香り、果実（マルメロ、グレープフルーツ、ライチ）、スパイス（シナモン）の香りが漂います。\nこの香り高いワインは熟成に適しています。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '6年以内にお楽しみください。',
      suggestion: '食前酒、チーズ（青カビ、ロックフォール、ミュンスター）、カレー料理やエキゾチックな料理。'
    }
  ])

  console.log('✅ Gewurztraminer')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'cremant_d_alsace',
      languageId: french_id,
      name: 'Crémant d\'Alsace',
      description: 'Il s\'agit d\'un vin mousseux obtenu par la méthode champenoise appliquée aux vins d\'Alsace avec fermentation en bouteille.\nLa robe est jaune pâle avec reflets verts, les bulles fines. Le nez expressif de fruits à chair blanche (pêche). En bouche, on trouve un bel équilibre entre l’acidité et les sucres.',
      tasting: 'Servir à 8°C.',
      conservation: 'À apprécier dans les 6 ans.',
      suggestion: 'Apéritif et desserts.'
    },
    {
      wineSlug: 'cremant_d_alsace',
      languageId: english_id,
      name: 'Crémant d\'Alsace',
      description: 'This is a sparkling wine obtained by the champagne method applied to Alsatian wines with bottle fermentation.\nThe color is pale yellow with green reflections, and fine bubbles. The expressive nose of white-fleshed fruits (peach). In the mouth, there is a nice balance between acidity and sugars.',
      tasting: 'Serve at 8°C.',
      conservation: 'To be enjoyed within 6 years.',
      suggestion: 'Aperitif and desserts.'
    },
    {
      wineSlug: 'cremant_d_alsace',
      languageId: japanese_id,
      name: 'クレマン・ダルザス',
      description: 'アルザスワインに瓶内二次発酵を施したシャンパン製法で造られたスパークリングワインです。\n淡い黄色に緑の反射があり、細かい泡立ち。白桃のような白い果実の香りが漂います。口に含むと、酸味と糖分のバランスが絶妙です。',
      tasting: '8°Cでサーブしてください。',
      conservation: '6年以内にお楽しみください。',
      suggestion: '食前酒やデザートに。'
    }
  ])

  console.log('✅ Crémant d\'Alsace')

  console.log('\n🪨 Pierreries completed successfully\n')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'riesling_emeraude',
      languageId: french_id,
      name: 'Riesling Émeraude',
      description: 'Issus de la récolte des vignes âgées de plus de trente ans, ces vins présentent tous les caractéristiques de leur cépage alliant puissance, rondeur et fraîcheur.\nUne robe jaune paille, un nez aromatique avec des nuances de fleurs blanches, d’agrumes (pamplemousse rose) et une touche minérale, voila ce qui caractérise au mieux ce vin. La bouche est ample et riche avec une acidité élégante en longueur.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 10 ans.',
      suggestion: 'Poissons, fruits de mer, choucroute, escargots, cuisses de grenouilles, coq au riesling, viandes blanches en sauce.'
    },
    {
      wineSlug: 'riesling_emeraude',
      languageId: english_id,
      name: 'Riesling Émeraude',
      description: 'From the harvest of vines over thirty years old, these wines present all the characteristics of their grape variety combining power, roundness and freshness.\nA straw yellow color, an aromatic nose with hints of white flowers, citrus (pink grapefruit) and a mineral touch, this is what best characterizes this wine. The mouth is ample and rich with an elegant acidity in length.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 10 years.',
      suggestion: 'Fish, seafood, sauerkraut, snails, frogs\' legs, coq au riesling, white meats in sauce.'
    },
    {
      wineSlug: 'riesling_emeraude',
      languageId: japanese_id,
      name: 'リースリング・エメラルド',
      description: '30年以上の古木から収穫されたワインで、力強さ、まろやかさ、新鮮さを兼ね備えたブドウ品種の特徴をすべて持っています。\nストローイエローの色合いで、白い花、シトラス（ピンクグレープフルーツ）、ミネラルのヒントが漂う香りが特徴です。このワインの特徴を最もよく表しています。口に含むと、豊かでリッチな味わいで、長く続くエレガントな酸味があります。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '10年以内にお楽しみください。',
      suggestion: '魚介類、シュークルート、エスカルゴ、カエルの足、リースリング風鶏肉、ソースを添えた白身肉。'
    }
  ])

  console.log('✅ Riesling Émeraude')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'pinot_gris_saphir',
      languageId: french_id,
      name: 'Pinot Gris Saphir',
      description: 'Issus de la récolte des vignes âgées de plus de trente ans, ces vins présentent tous les caractéristiques de leur cépage alliant puissance, rondeur et fraîcheur.\nLa robe est d’un jaune d’or soutenue avec des reflets verts. Le nez aromatique est complexe aux notes florales, d’agrumes bien mûrs. La bouche est ample, aromatique et soutenue par une acidité plaisante.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 6 ans.',
      suggestion: 'Plat à base de volailles, viandes blanches, poissons en sauce, apéritif…'
    },
    {
      wineSlug: 'pinot_gris_saphir',
      languageId: english_id,
      name: 'Pinot Gris Saphir',
      description: 'From the harvest of vines over thirty years old, these wines present all the characteristics of their grape variety combining power, roundness and freshness.\nThe color is a deep golden yellow with green reflections. The aromatic nose is complex with floral notes and very ripe citrus fruits. The mouth is ample, aromatic and supported by a pleasant acidity.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 6 years.',
      suggestion: 'Dishes based on poultry, white meats, fish in sauce, aperitif...'
    },
    {
      wineSlug: 'pinot_gris_saphir',
      languageId: japanese_id,
      name: 'ピノ・グリ・サフィール',
      description: '30年以上の古木から収穫されたワインで、力強さ、まろやかさ、新鮮さを兼ね備えたブドウ品種の特徴をすべて持っています。\n濃い金色に緑の反射があり、香りは複雑で花の香りと熟したシトラスの香りが漂います。口に含むと、豊かで香り高く、心地よい酸味が感じられます。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '6年以内にお楽しみください。',
      suggestion: '鶏肉料理、白身肉料理、ソースを添えた魚料理、食前酒…'
    }
  ])

  console.log('✅ Pinot Gris Saphir')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'gewurztraminer_diamant',
      languageId: french_id,
      name: 'Gewurztraminer Diamant',
      description: 'Issus de la récolte des vignes âgées de plus de trente ans, ces vins présentent tous les' +
        ' caractéristiques de leur cépage alliant puissance, rondeur et fraîcheur.\nD’une robe jaune soutenue, issu' +
        ' d’une grande matière première, ce vin présente au nez des arômes complexes de roses, fruits confits et litchi. La bouche est ample, riche, grande avec une palette aromatique impressionnante.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 10 ans.',
      suggestion: 'Apéritif, fromages (bleue, roquefort, munster, etc.), dessert.'
    },
    {
      wineSlug: 'gewurztraminer_diamant',
      languageId: english_id,
      name: 'Gewurztraminer Diamant',
      description: 'From the harvest of vines over thirty years old, these wines present all the characteristics of their grape variety combining power, roundness and freshness.\nWith a deep yellow color, made from a great raw material, this wine presents complex aromas of roses, candied fruits and lychee on the nose. The mouth is ample, rich, great with an impressive aromatic palette.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 10 years.',
      suggestion: 'Aperitif, cheeses (blue cheese, roquefort, munster, etc.), dessert.'
    },
    {
      wineSlug: 'gewurztraminer_diamant',
      languageId: japanese_id,
      name: 'ゲヴュルツトラミネール・ダイヤモンド',
      description: '30年以上の古木から収穫されたワインで、力強さ、まろやかさ、新鮮さを兼ね備えたブドウ品種の特徴をすべて持っています。\n濃い黄色の色合いで、素晴らしい原料から作られたこのワインは、香りにバラ、コンフィチュール、ライチの複雑な香りが漂います。口に含むと、豊かでリッチな味わいで、印象的な香りのパレットがあります。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '10年以内にお楽しみください。',
      suggestion: '食前酒、チーズ（青カビ、ロックフォール、ミュンスターなど）、デザート。'
    }
  ])

  console.log('✅ Gewurztraminer Diamant')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'pinot_noir_rubis',
      languageId: french_id,
      name: 'Pinot Noir Rubis',
      description: 'Issus de la récolte des vignes âgées de plus de trente ans, ces vins présentent tous les' +
        ' caractéristiques de leur cépage alliant puissance, rondeur et fraîcheur.\nDe cuvaison plus longue, vieilli' +
        ' en fûts de chêne, c\'est un vin corsé et équilibré. Une robe sombre et des arômes intenses de cerise, sa' +
        ' puissance subtile vous laissera une incomparable saveur.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 10 ans.',
      suggestion: 'Viande rouge, grillade, gibier...'
    },
    {
      wineSlug: 'pinot_noir_rubis',
      languageId: english_id,
      name: 'Pinot Noir Rubis',
      description: 'From the harvest of vines over thirty years old, these wines present all the characteristics of their grape variety combining power, roundness and freshness.\nWith a longer maceration, aged in oak barrels, this is a full-bodied and balanced wine. A dark color and intense aromas of cherry, its subtle power will leave you with an incomparable flavor.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 10 years.',
      suggestion: 'Red meat, grilled dishes, game...'
    },
    {
      wineSlug: 'pinot_noir_rubis',
      languageId: japanese_id,
      name: 'ピノ・ノワール・ルビー',
      description: '30年以上の古木から収穫されたワインで、力強さ、まろやかさ、新鮮さを兼ね備えたブドウ品種の特徴をすべて持っています。\n長めのマセレーションで、オーク樽で熟成されており、コクがありバランスの取れたワインです。濃い色合いと濃厚なさくらんぼの香りが漂い、微妙な力強さが比類のない風味を残します。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '10年以内にお楽しみください。',
      suggestion: '赤身肉、グリル料理、ジビエ…'
    }
  ])

  console.log('✅ Pinot Noir Rubis')

  console.log('\n🪨 Pierres Précieuses completed successfully\n')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'riesling_eichberg',
      languageId: french_id,
      name: 'Riesling Eichberg',
      description: 'Issus de nos Grands Crus, les vins sont marqués par la personnalité de chaque terroir et par le' +
        ' cépage. C\'est dans le sous-sol que ces grands vins puisent leur caractère.\nRobe jaune, or, soutenue à reflets verts. Nez d’agrumes et florale. Palais à l’attaque franche, vin charpenté, arômes d’agrumes citron et pamplemousse rose, légère minéralité. Vin gras.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 15 ans.',
      suggestion: 'Poissons en sauce, homard, fromages frais et épicés (chèvre), volailles en sauce…'
    },
    {
      wineSlug: 'riesling_eichberg',
      languageId: english_id,
      name: 'Riesling Eichberg',
      description: 'From our Grands Crus, the wines are marked by the personality of each terroir and by the grape variety. It is in the subsoil that these great wines draw their character.\nYellow, gold color, with green reflections. Nose of citrus and floral notes. The palate has a frank attack, structured wine, aromas of citrus lemon and pink grapefruit, light minerality. Fat wine.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 15 years.',
      suggestion: 'Fish in sauce, lobster, fresh and spicy cheeses (goat), poultry in sauce...'
    },
    {
      wineSlug: 'riesling_eichberg',
      languageId: japanese_id,
      name: 'リースリング・アイヒベルグ',
      description: 'グランクリュから生まれたワインは、各テロワールの個性とブドウ品種によって特徴づけられています。これらの偉大なワインは、地下にそのキャラクターを見出します。\n黄色、金色で、緑の反射があり、柑橘系の香りと花の香りが漂います。口に含むと、しっかりとした味わいで、レモンやピンクグレープフルーツの香りが広がり、軽いミネラル感があります。コクのあるワインです。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '15年以内にお楽しみください。',
      suggestion: 'ソースを添えた魚料理、ロブスター、新鮮でスパイシーなチーズ（山羊）、ソースを添えた鶏肉…'
    }
  ])

  console.log('✅ Riesling Eichberg')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'pinot_gris_eichberg',
      languageId: french_id,
      name: 'Pinot Gris Eichberg',
      description: 'Issus de nos Grands Crus, les vins sont marqués par la personnalité de chaque terroir et par le' +
        ' cépage. C\'est dans le sous-sol que ces grands vins puisent leur caractère.\nRobe jaune soutenue. Nez aux' +
        ' arômes d’agrumes, fruits cuits et sous bois. Palais très ample et corsé aux arômes de fruits confits, notes grillées, rondeur en finale.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 15 ans.',
      suggestion: 'Apéritif, foie gras, homard, coquille st Jacques…'
    },
    {
      wineSlug: 'pinot_gris_eichberg',
      languageId: english_id,
      name: 'Pinot Gris Eichberg',
      description: 'From our Grands Crus, the wines are marked by the personality of each terroir and by the grape variety. It is in the subsoil that these great wines draw their character.\nDeep yellow color. Nose with aromas of citrus, cooked fruits and undergrowth. Very ample and full-bodied palate with aromas of candied fruits, toasted notes, roundness in the finish.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 15 years.',
      suggestion: 'Aperitif, foie gras, lobster, scallops...'
    },
    {
      wineSlug: 'pinot_gris_eichberg',
      languageId: japanese_id,
      name: 'ピノ・グリ・アイヒベルグ',
      description: 'グランクリュから生まれたワインは、各テロワールの個性とブドウ品種によって特徴づけられています。これらの偉大なワインは、地下にそのキャラクターを見出します。\n濃い黄色の色合いで、柑橘系の香り、焼き果実、土の香りが漂います。口に含むと、非常に豊かでコクがあり、コンフィチュールの香り、トーストした香りが広がり、最後にまろやかさがあります。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '15年以内にお楽しみください。',
      suggestion: '食前酒、フォアグラ、ロブスター、ホタテ…'
    }
  ])

  console.log('✅ Pinot Gris Eichberg')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'gewurztraminer_pfersigberg',
      languageId: french_id,
      name: 'Gewurztraminer Pfersigberg',
      description: 'Issus de nos Grands Crus, les vins sont marqués par la personnalité de chaque terroir et par le' +
        ' cépage. C\'est dans le sous-sol que ces grands vins puisent leur caractère.\nRobe jaune paille. Nez aux arômes de fleurs, roses séchées, violette. Palais ample et gras aux arômes d’épices avec une touche minérale.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 15 ans.',
      suggestion: 'Apéritif, foie gras, fromage, cuisines exotiques.'
    },
    {
      wineSlug: 'gewurztraminer_pfersigberg',
      languageId: english_id,
      name: 'Gewurztraminer Pfersigberg',
      description: 'From our Grands Crus, the wines are marked by the personality of each terroir and by the grape variety. It is in the subsoil that these great wines draw their character.\nPale yellow color. Nose with aromas of flowers, dried roses, violets. Ample and fat palate with spicy aromas with a mineral touch.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 15 years.',
      suggestion: 'Aperitif, foie gras, cheese, exotic cuisines.'
    },
    {
      wineSlug: 'gewurztraminer_pfersigberg',
      languageId: japanese_id,
      name: 'ゲヴュルツトラミネール・フェルジグベルグ',
      description: 'グランクリュから生まれたワインは、各テロワールの個性とブドウ品種によって特徴づけられています。これらの偉大なワインは、地下にそのキャラクターを見出します。\n淡い黄色の色合いで、花の香り、乾燥したバラ、スミレの香りが漂います。口に含むと、豊かでコクがあり、スパイシーな香りとミネラル感があります。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '15年以内にお楽しみください。',
      suggestion: '食前酒、フォアグラ、チーズ、エキゾチックな料理。'
    }
  ])

  console.log('✅ Gewurztraminer Pfersigberg')

  console.log('\n🪨 Grand Cru completed successfully\n')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'gewurztraminer_vendanges_tardives',
      languageId: french_id,
      name: 'Gewurztraminer Vendanges Tardives',
      description: 'Dans les années où la maturité des raisins est bonne, en fonction des conditions climatiques,' +
        ' nous cueillons les grappes qui portent des grains très murs ou sur mûris. Ces raisins, typés par le' +
        ' cépage, sont laissés sur pied plus longtemps de façon à concentrer le sucre et faire baisser l\'acidité.\nRobe or jaune très dense. Nez aromatique riche et complexe aux arômes de fruits confits et de miel. En bouche, vin très ample aux arômes concentrés de fruits jaunes (abricot, pêche jaune). Persistance aromatique très longue.',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 20 ans.',
      suggestion: 'Apéritif, foie gras, dessert…'
    },
    {
      wineSlug: 'gewurztraminer_vendanges_tardives',
      languageId: english_id,
      name: 'Gewurztraminer Vendanges Tardives',
      description: 'In years when the maturity of the grapes is good, depending on climatic conditions, we pick the bunches that bear very ripe or overripe berries. These grapes, typified by the grape variety, are left on the vine longer to concentrate the sugar and lower the acidity.\nVery dense golden yellow color. Rich and complex aromatic nose with aromas of candied fruits and honey. In the mouth, a very ample wine with concentrated aromas of yellow fruits (apricot, yellow peach). Very long aromatic persistence.',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 20 years.',
      suggestion: 'Aperitif, foie gras, dessert...'
    },
    {
      wineSlug: 'gewurztraminer_vendanges_tardives',
      languageId: japanese_id,
      name: 'ゲヴュルツトラミネール・ヴァンダンジュ・タルディーヴ',
      description: 'ブドウの熟度が良い年には、気候条件に応じて、非常に熟した房や過熟した房を収穫します。これらのブドウは、ブドウ品種によって特徴づけられ、糖分を濃縮し、酸味を下げるために、より長く木に残されます。\n非常に濃い金色の色合いで、香りはリッチで複雑で、コンフィチュールやハチミツの香りが漂います。口に含むと、アプリコットや黄桃の香りが広がる豊かなワインです。非常に長い香りの持続性があります。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '20年以内にお楽しみください。',
      suggestion: '食前酒、フォアグラ、デザート…'
    }
  ])

  console.log('✅ Gewurztraminer Vendanges Tardives')

  await db.insert(wineTranslationTable).values([
    {
      wineSlug: 'pinot_gris_vendanges_tardives',
      languageId: french_id,
      name: 'Pinot Gris Vendanges Tardives',
      description: 'Dans les années où la maturité des raisins est bonne, en fonction des conditions climatiques,' +
        ' nous cueillons les grappes qui portent des grains très murs ou sur mûris. Ces raisins, typés par le cépage, sont laissés sur pied plus longtemps de façon à concentrer le sucre et faire baisser l\'acidité.\nRobe jaune or soutenue. Le nez développe des arômes de fruits confits, miel d’acacia, de pamplemousse confit. Palais ample et frais aux arômes de fruits confits, fin et long…',
      tasting: 'Servir à 8°C, n\'hésitez pas à le passer en carafe pour développer ses arômes.',
      conservation: 'À apprécier dans les 20 ans.',
      suggestion: 'Apéritif, foie gras, fromage, dessert…'
    },
    {
      wineSlug: 'pinot_gris_vendanges_tardives',
      languageId: english_id,
      name: 'Pinot Gris Vendanges Tardives',
      description: 'In years when the maturity of the grapes is good, depending on climatic conditions, we pick the bunches that bear very ripe or overripe berries. These grapes, typified by the grape variety, are left on the vine longer to concentrate the sugar and lower the acidity.\nDeep golden yellow color. The nose develops aromas of candied fruits, acacia honey, candied grapefruit. Ample and fresh palate with aromas of candied fruits, fine and long...',
      tasting: 'Serve at 8°C, do not hesitate to pass it in a carafe to develop its aromas.',
      conservation: 'To be enjoyed within 20 years.',
      suggestion: 'Aperitif, foie gras, cheese, dessert...',
    },
    {
      wineSlug: 'pinot_gris_vendanges_tardives',
      languageId: japanese_id,
      name: 'ピノ・グリ・ヴァンダンジュ・タルディーヴ',
      description: 'ブドウの熟度が良い年には、気候条件に応じて、非常に熟した房や過熟した房を収穫します。これらのブドウは、ブドウ品種によって特徴づけられ、糖分を濃縮し、酸味を下げるために、より長く木に残されます。\n濃い金色の色合いで、香りはコンフィチュールやアカシアのハチミツ、コンフィグレープフルーツの香りが漂います。口に含むと、豊かで新鮮な味わいで、コンフィチュールの香りが広がり、繊細で長い余韻があります。',
      tasting: '8°Cでサーブし、香りを引き出すためにデキャンタに移しても良いでしょう。',
      conservation: '20年以内にお楽しみください。',
      suggestion: '食前酒、フォアグラ、チーズ、デザート…'
    }
  ])

  console.log('✅ Pinot Gris Vendanges Tardives')

  console.log('\n🪨 Vendanges Tardives completed successfully\n')

  console.log('🌐 Wine translation data inserted successfully!')
}

export {
  insertRange,
  insertLanguage,
  insertWine,
  insertWineTranslation,
}