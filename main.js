const obsidian = require('obsidian');
let playing = null; 
let audioCache = {}; // Initialize the cache object

const DEFAULT_SETTINGS = {
    current_voice: "en-TZ-ImaniNeural",
    volume: 1,
    rate: 1,
};

const VOICES = {
    "af-ZA": [
        {
            VoiceName: "Microsoft Adri Online (Natural)",
            VoiceURI: "af-ZA-AdriNeural",
        },
        {
            VoiceName: "Microsoft Willem Online (Natural)",
            VoiceURI: "af-ZA-WillemNeural",
        },
    ],
    "sq-AL": [
        {
            VoiceName: "Microsoft Anila Online (Natural)",
            VoiceURI: "sq-AL-AnilaNeural",
        },
        {
            VoiceName: "Microsoft Ilir Online (Natural)",
            VoiceURI: "sq-AL-IlirNeural",
        },
    ],
    "am-ET": [
        {
            VoiceName: "Microsoft Ameha Online (Natural)",
            VoiceURI: "am-ET-AmehaNeural",
        },
        {
            VoiceName: "Microsoft Mekdes Online (Natural)",
            VoiceURI: "am-ET-MekdesNeural",
        },
    ],
    "ar-DZ": [
        {
            VoiceName: "Microsoft Amina Online (Natural)",
            VoiceURI: "ar-DZ-AminaNeural",
        },
        {
            VoiceName: "Microsoft Ismael Online (Natural)",
            VoiceURI: "ar-DZ-IsmaelNeural",
        },
    ],
    "ar-BH": [
        {
            VoiceName: "Microsoft Ali Online (Natural)",
            VoiceURI: "ar-BH-AliNeural",
        },
        {
            VoiceName: "Microsoft Laila Online (Natural)",
            VoiceURI: "ar-BH-LailaNeural",
        },
    ],
    "ar-EG": [
        {
            VoiceName: "Microsoft Salma Online (Natural)",
            VoiceURI: "ar-EG-SalmaNeural",
        },
        {
            VoiceName: "Microsoft Shakir Online (Natural)",
            VoiceURI: "ar-EG-ShakirNeural",
        },
    ],
    "ar-IQ": [
        {
            VoiceName: "Microsoft Bassel Online (Natural)",
            VoiceURI: "ar-IQ-BasselNeural",
        },
        {
            VoiceName: "Microsoft Rana Online (Natural)",
            VoiceURI: "ar-IQ-RanaNeural",
        },
    ],
    "ar-JO": [
        {
            VoiceName: "Microsoft Sana Online (Natural)",
            VoiceURI: "ar-JO-SanaNeural",
        },
        {
            VoiceName: "Microsoft Taim Online (Natural)",
            VoiceURI: "ar-JO-TaimNeural",
        },
    ],
    "ar-KW": [
        {
            VoiceName: "Microsoft Fahed Online (Natural)",
            VoiceURI: "ar-KW-FahedNeural",
        },
        {
            VoiceName: "Microsoft Noura Online (Natural)",
            VoiceURI: "ar-KW-NouraNeural",
        },
    ],
    "ar-LB": [
        {
            VoiceName: "Microsoft Layla Online (Natural)",
            VoiceURI: "ar-LB-LaylaNeural",
        },
        {
            VoiceName: "Microsoft Rami Online (Natural)",
            VoiceURI: "ar-LB-RamiNeural",
        },
    ],
    "ar-LY": [
        {
            VoiceName: "Microsoft Iman Online (Natural)",
            VoiceURI: "ar-LY-ImanNeural",
        },
        {
            VoiceName: "Microsoft Omar Online (Natural)",
            VoiceURI: "ar-LY-OmarNeural",
        },
    ],
    "ar-MA": [
        {
            VoiceName: "Microsoft Jamal Online (Natural)",
            VoiceURI: "ar-MA-JamalNeural",
        },
        {
            VoiceName: "Microsoft Mouna Online (Natural)",
            VoiceURI: "ar-MA-MounaNeural",
        },
    ],
    "ar-OM": [
        {
            VoiceName: "Microsoft Abdullah Online (Natural)",
            VoiceURI: "ar-OM-AbdullahNeural",
        },
        {
            VoiceName: "Microsoft Aysha Online (Natural)",
            VoiceURI: "ar-OM-AyshaNeural",
        },
    ],
    "ar-QA": [
        {
            VoiceName: "Microsoft Amal Online (Natural)",
            VoiceURI: "ar-QA-AmalNeural",
        },
        {
            VoiceName: "Microsoft Moaz Online (Natural)",
            VoiceURI: "ar-QA-MoazNeural",
        },
    ],
    "ar-SA": [
        {
            VoiceName: "Microsoft Hamed Online (Natural)",
            VoiceURI: "ar-SA-HamedNeural",
        },
        {
            VoiceName: "Microsoft Zariyah Online (Natural)",
            VoiceURI: "ar-SA-ZariyahNeural",
        },
    ],
    "ar-SY": [
        {
            VoiceName: "Microsoft Amany Online (Natural)",
            VoiceURI: "ar-SY-AmanyNeural",
        },
        {
            VoiceName: "Microsoft Laith Online (Natural)",
            VoiceURI: "ar-SY-LaithNeural",
        },
    ],
    "ar-TN": [
        {
            VoiceName: "Microsoft Hedi Online (Natural)",
            VoiceURI: "ar-TN-HediNeural",
        },
        {
            VoiceName: "Microsoft Reem Online (Natural)",
            VoiceURI: "ar-TN-ReemNeural",
        },
    ],
    "ar-AE": [
        {
            VoiceName: "Microsoft Fatima Online (Natural)",
            VoiceURI: "ar-AE-FatimaNeural",
        },
        {
            VoiceName: "Microsoft Hamdan Online (Natural)",
            VoiceURI: "ar-AE-HamdanNeural",
        },
    ],
    "ar-YE": [
        {
            VoiceName: "Microsoft Maryam Online (Natural)",
            VoiceURI: "ar-YE-MaryamNeural",
        },
        {
            VoiceName: "Microsoft Saleh Online (Natural)",
            VoiceURI: "ar-YE-SalehNeural",
        },
    ],
    "az-AZ": [
        {
            VoiceName: "Microsoft Babek Online (Natural)",
            VoiceURI: "az-AZ-BabekNeural",
        },
        {
            VoiceName: "Microsoft Banu Online (Natural)",
            VoiceURI: "az-AZ-BanuNeural",
        },
    ],
    "bn-BD": [
        {
            VoiceName: "Microsoft Nabanita Online (Natural)",
            VoiceURI: "bn-BD-NabanitaNeural",
        },
        {
            VoiceName: "Microsoft Pradeep Online (Natural)",
            VoiceURI: "bn-BD-PradeepNeural",
        },
    ],
    "bn-IN": [
        {
            VoiceName: "Microsoft Bashkar Online (Natural)",
            VoiceURI: "bn-IN-BashkarNeural",
        },
        {
            VoiceName: "Microsoft Tanishaa Online (Natural)",
            VoiceURI: "bn-IN-TanishaaNeural",
        },
    ],
    "bs-BA": [
        {
            VoiceName: "Microsoft Goran Online (Natural)",
            VoiceURI: "bs-BA-GoranNeural",
        },
        {
            VoiceName: "Microsoft Vesna Online (Natural)",
            VoiceURI: "bs-BA-VesnaNeural",
        },
    ],
    "bg-BG": [
        {
            VoiceName: "Microsoft Borislav Online (Natural)",
            VoiceURI: "bg-BG-BorislavNeural",
        },
        {
            VoiceName: "Microsoft Kalina Online (Natural)",
            VoiceURI: "bg-BG-KalinaNeural",
        },
    ],
    "my-MM": [
        {
            VoiceName: "Microsoft Nilar Online (Natural)",
            VoiceURI: "my-MM-NilarNeural",
        },
        {
            VoiceName: "Microsoft Thiha Online (Natural)",
            VoiceURI: "my-MM-ThihaNeural",
        },
    ],
    "ca-ES": [
        {
            VoiceName: "Microsoft Enric Online (Natural)",
            VoiceURI: "ca-ES-EnricNeural",
        },
        {
            VoiceName: "Microsoft Joana Online (Natural)",
            VoiceURI: "ca-ES-JoanaNeural",
        },
    ],
    "zh-HK": [
        {
            VoiceName: "Microsoft HiuGaai Online (Natural)",
            VoiceURI: "zh-HK-HiuGaaiNeural",
        },
        {
            VoiceName: "Microsoft HiuMaan Online (Natural)",
            VoiceURI: "zh-HK-HiuMaanNeural",
        },
        {
            VoiceName: "Microsoft WanLung Online (Natural)",
            VoiceURI: "zh-HK-WanLungNeural",
        },
    ],
    "zh-CN": [
        {
            VoiceName: "Microsoft Xiaoxiao Online (Natural)",
            VoiceURI: "zh-CN-XiaoxiaoNeural",
        },
        {
            VoiceName: "Microsoft Xiaoyi Online (Natural)",
            VoiceURI: "zh-CN-XiaoyiNeural",
        },
        {
            VoiceName: "Microsoft Yunjian Online (Natural)",
            VoiceURI: "zh-CN-YunjianNeural",
        },
        {
            VoiceName: "Microsoft Yunxi Online (Natural)",
            VoiceURI: "zh-CN-YunxiNeural",
        },
        {
            VoiceName: "Microsoft Yunxia Online (Natural)",
            VoiceURI: "zh-CN-YunxiaNeural",
        },
        {
            VoiceName: "Microsoft Yunyang Online (Natural)",
            VoiceURI: "zh-CN-YunyangNeural",
        },
    ],
    "zh-CN-liaoning": [
        {
            VoiceName: "Microsoft Xiaobei Online (Natural)",
            VoiceURI: "zh-CN-liaoning-XiaobeiNeural",
        },
    ],
    "zh-TW": [
        {
            VoiceName: "Microsoft HsiaoChen Online (Natural)",
            VoiceURI: "zh-TW-HsiaoChenNeural",
        },
        {
            VoiceName: "Microsoft YunJhe Online (Natural)",
            VoiceURI: "zh-TW-YunJheNeural",
        },
        {
            VoiceName: "Microsoft HsiaoYu Online (Natural)",
            VoiceURI: "zh-TW-HsiaoYuNeural",
        },
    ],
    "zh-CN-shaanxi": [
        {
            VoiceName: "Microsoft Xiaoni Online (Natural)",
            VoiceURI: "zh-CN-shaanxi-XiaoniNeural",
        },
    ],
    "hr-HR": [
        {
            VoiceName: "Microsoft Gabrijela Online (Natural)",
            VoiceURI: "hr-HR-GabrijelaNeural",
        },
        {
            VoiceName: "Microsoft Srecko Online (Natural)",
            VoiceURI: "hr-HR-SreckoNeural",
        },
    ],
    "cs-CZ": [
        {
            VoiceName: "Microsoft Antonin Online (Natural)",
            VoiceURI: "cs-CZ-AntoninNeural",
        },
        {
            VoiceName: "Microsoft Vlasta Online (Natural)",
            VoiceURI: "cs-CZ-VlastaNeural",
        },
    ],
    "da-DK": [
        {
            VoiceName: "Microsoft Christel Online (Natural)",
            VoiceURI: "da-DK-ChristelNeural",
        },
        {
            VoiceName: "Microsoft Jeppe Online (Natural)",
            VoiceURI: "da-DK-JeppeNeural",
        },
    ],
    "nl-BE": [
        {
            VoiceName: "Microsoft Arnaud Online (Natural)",
            VoiceURI: "nl-BE-ArnaudNeural",
        },
        {
            VoiceName: "Microsoft Dena Online (Natural)",
            VoiceURI: "nl-BE-DenaNeural",
        },
    ],
    "nl-NL": [
        {
            VoiceName: "Microsoft Colette Online (Natural)",
            VoiceURI: "nl-NL-ColetteNeural",
        },
        {
            VoiceName: "Microsoft Fenna Online (Natural)",
            VoiceURI: "nl-NL-FennaNeural",
        },
        {
            VoiceName: "Microsoft Maarten Online (Natural)",
            VoiceURI: "nl-NL-MaartenNeural",
        },
    ],
    "en-AU": [
        {
            VoiceName: "Microsoft Natasha Online (Natural)",
            VoiceURI: "en-AU-NatashaNeural",
        },
        {
            VoiceName: "Microsoft William Online (Natural)",
            VoiceURI: "en-AU-WilliamNeural",
        },
    ],
    "en-CA": [
        {
            VoiceName: "Microsoft Clara Online (Natural)",
            VoiceURI: "en-CA-ClaraNeural",
        },
        {
            VoiceName: "Microsoft Liam Online (Natural)",
            VoiceURI: "en-CA-LiamNeural",
        },
    ],
    "en-HK": [
        {
            VoiceName: "Microsoft Sam Online (Natural)",
            VoiceURI: "en-HK-SamNeural",
        },
        {
            VoiceName: "Microsoft Yan Online (Natural)",
            VoiceURI: "en-HK-YanNeural",
        },
    ],
    "en-IN": [
        {
            VoiceName: "Microsoft Neerja Online (Natural)",
            VoiceURI: "en-IN-NeerjaExpressiveNeural",
        },
        {
            VoiceName: "Microsoft Neerja Online (Natural)",
            VoiceURI: "en-IN-NeerjaNeural",
        },
        {
            VoiceName: "Microsoft Prabhat Online (Natural)",
            VoiceURI: "en-IN-PrabhatNeural",
        },
    ],
    "en-IE": [
        {
            VoiceName: "Microsoft Connor Online (Natural)",
            VoiceURI: "en-IE-ConnorNeural",
        },
        {
            VoiceName: "Microsoft Emily Online (Natural)",
            VoiceURI: "en-IE-EmilyNeural",
        },
    ],
    "en-KE": [
        {
            VoiceName: "Microsoft Asilia Online (Natural)",
            VoiceURI: "en-KE-AsiliaNeural",
        },
        {
            VoiceName: "Microsoft Chilemba Online (Natural)",
            VoiceURI: "en-KE-ChilembaNeural",
        },
    ],
    "en-NZ": [
        {
            VoiceName: "Microsoft Mitchell Online (Natural)",
            VoiceURI: "en-NZ-MitchellNeural",
        },
        {
            VoiceName: "Microsoft Molly Online (Natural)",
            VoiceURI: "en-NZ-MollyNeural",
        },
    ],
    "en-NG": [
        {
            VoiceName: "Microsoft Abeo Online (Natural)",
            VoiceURI: "en-NG-AbeoNeural",
        },
        {
            VoiceName: "Microsoft Ezinne Online (Natural)",
            VoiceURI: "en-NG-EzinneNeural",
        },
    ],
    "en-PH": [
        {
            VoiceName: "Microsoft James Online (Natural)",
            VoiceURI: "en-PH-JamesNeural",
        },
        {
            VoiceName: "Microsoft Rosa Online (Natural)",
            VoiceURI: "en-PH-RosaNeural",
        },
    ],
    "en-SG": [
        {
            VoiceName: "Microsoft Luna Online (Natural)",
            VoiceURI: "en-SG-LunaNeural",
        },
        {
            VoiceName: "Microsoft Wayne Online (Natural)",
            VoiceURI: "en-SG-WayneNeural",
        },
    ],
    "en-ZA": [
        {
            VoiceName: "Microsoft Leah Online (Natural)",
            VoiceURI: "en-ZA-LeahNeural",
        },
        {
            VoiceName: "Microsoft Luke Online (Natural)",
            VoiceURI: "en-ZA-LukeNeural",
        },
    ],
    "en-TZ": [
        {
            VoiceName: "Microsoft Elimu Online (Natural)",
            VoiceURI: "en-TZ-ElimuNeural",
        },
        {
            VoiceName: "Microsoft Imani Online (Natural)",
            VoiceURI: "en-TZ-ImaniNeural",
        },
    ],
    "en-GB": [
        {
            VoiceName: "Microsoft Libby Online (Natural)",
            VoiceURI: "en-GB-LibbyNeural",
        },
        {
            VoiceName: "Microsoft Maisie Online (Natural)",
            VoiceURI: "en-GB-MaisieNeural",
        },
        {
            VoiceName: "Microsoft Ryan Online (Natural)",
            VoiceURI: "en-GB-RyanNeural",
        },
        {
            VoiceName: "Microsoft Sonia Online (Natural)",
            VoiceURI: "en-GB-SoniaNeural",
        },
        {
            VoiceName: "Microsoft Thomas Online (Natural)",
            VoiceURI: "en-GB-ThomasNeural",
        },
    ],
    "en-US": [
        {
            VoiceName: "Microsoft Aria Online (Natural)",
            VoiceURI: "en-US-AriaNeural",
        },
        {
            VoiceName: "Microsoft Ana Online (Natural)",
            VoiceURI: "en-US-AnaNeural",
        },
        {
            VoiceName: "Microsoft Christopher Online (Natural)",
            VoiceURI: "en-US-ChristopherNeural",
        },
        {
            VoiceName: "Microsoft Eric Online (Natural)",
            VoiceURI: "en-US-EricNeural",
        },
        {
            VoiceName: "Microsoft Guy Online (Natural)",
            VoiceURI: "en-US-GuyNeural",
        },
        {
            VoiceName: "Microsoft Jenny Online (Natural)",
            VoiceURI: "en-US-JennyNeural",
        },
        {
            VoiceName: "Microsoft Michelle Online (Natural)",
            VoiceURI: "en-US-MichelleNeural",
        },
        {
            VoiceName: "Microsoft Roger Online (Natural)",
            VoiceURI: "en-US-RogerNeural",
        },
        {
            VoiceName: "Microsoft Steffan Online (Natural)",
            VoiceURI: "en-US-SteffanNeural",
        },
    ],
    "et-EE": [
        {
            VoiceName: "Microsoft Anu Online (Natural)",
            VoiceURI: "et-EE-AnuNeural",
        },
        {
            VoiceName: "Microsoft Kert Online (Natural)",
            VoiceURI: "et-EE-KertNeural",
        },
    ],
    "fil-PH": [
        {
            VoiceName: "Microsoft Angelo Online (Natural)",
            VoiceURI: "fil-PH-AngeloNeural",
        },
        {
            VoiceName: "Microsoft Blessica Online (Natural)",
            VoiceURI: "fil-PH-BlessicaNeural",
        },
    ],
    "fi-FI": [
        {
            VoiceName: "Microsoft Harri Online (Natural)",
            VoiceURI: "fi-FI-HarriNeural",
        },
        {
            VoiceName: "Microsoft Noora Online (Natural)",
            VoiceURI: "fi-FI-NooraNeural",
        },
    ],
    "fr-BE": [
        {
            VoiceName: "Microsoft Charline Online (Natural)",
            VoiceURI: "fr-BE-CharlineNeural",
        },
        {
            VoiceName: "Microsoft Gerard Online (Natural)",
            VoiceURI: "fr-BE-GerardNeural",
        },
    ],
    "fr-CA": [
        {
            VoiceName: "Microsoft Antoine Online (Natural)",
            VoiceURI: "fr-CA-AntoineNeural",
        },
        {
            VoiceName: "Microsoft Jean Online (Natural)",
            VoiceURI: "fr-CA-JeanNeural",
        },
        {
            VoiceName: "Microsoft Sylvie Online (Natural)",
            VoiceURI: "fr-CA-SylvieNeural",
        },
    ],
    "fr-FR": [
        {
            VoiceName: "Microsoft Denise Online (Natural)",
            VoiceURI: "fr-FR-DeniseNeural",
        },
        {
            VoiceName: "Microsoft Eloise Online (Natural)",
            VoiceURI: "fr-FR-EloiseNeural",
        },
        {
            VoiceName: "Microsoft Henri Online (Natural)",
            VoiceURI: "fr-FR-HenriNeural",
        },
    ],
    "fr-CH": [
        {
            VoiceName: "Microsoft Ariane Online (Natural)",
            VoiceURI: "fr-CH-ArianeNeural",
        },
        {
            VoiceName: "Microsoft Fabrice Online (Natural)",
            VoiceURI: "fr-CH-FabriceNeural",
        },
    ],
    "gl-ES": [
        {
            VoiceName: "Microsoft Roi Online (Natural)",
            VoiceURI: "gl-ES-RoiNeural",
        },
        {
            VoiceName: "Microsoft Sabela Online (Natural)",
            VoiceURI: "gl-ES-SabelaNeural",
        },
    ],
    "ka-GE": [
        {
            VoiceName: "Microsoft Eka Online (Natural)",
            VoiceURI: "ka-GE-EkaNeural",
        },
        {
            VoiceName: "Microsoft Giorgi Online (Natural)",
            VoiceURI: "ka-GE-GiorgiNeural",
        },
    ],
    "de-AT": [
        {
            VoiceName: "Microsoft Ingrid Online (Natural)",
            VoiceURI: "de-AT-IngridNeural",
        },
        {
            VoiceName: "Microsoft Jonas Online (Natural)",
            VoiceURI: "de-AT-JonasNeural",
        },
    ],
    "de-DE": [
        {
            VoiceName: "Microsoft Amala Online (Natural)",
            VoiceURI: "de-DE-AmalaNeural",
        },
        {
            VoiceName: "Microsoft Conrad Online (Natural)",
            VoiceURI: "de-DE-ConradNeural",
        },
        {
            VoiceName: "Microsoft Katja Online (Natural)",
            VoiceURI: "de-DE-KatjaNeural",
        },
        {
            VoiceName: "Microsoft Killian Online (Natural)",
            VoiceURI: "de-DE-KillianNeural",
        },
    ],
    "de-CH": [
        {
            VoiceName: "Microsoft Jan Online (Natural)",
            VoiceURI: "de-CH-JanNeural",
        },
        {
            VoiceName: "Microsoft Leni Online (Natural)",
            VoiceURI: "de-CH-LeniNeural",
        },
    ],
    "el-GR": [
        {
            VoiceName: "Microsoft Athina Online (Natural)",
            VoiceURI: "el-GR-AthinaNeural",
        },
        {
            VoiceName: "Microsoft Nestoras Online (Natural)",
            VoiceURI: "el-GR-NestorasNeural",
        },
    ],
    "gu-IN": [
        {
            VoiceName: "Microsoft Dhwani Online (Natural)",
            VoiceURI: "gu-IN-DhwaniNeural",
        },
        {
            VoiceName: "Microsoft Niranjan Online (Natural)",
            VoiceURI: "gu-IN-NiranjanNeural",
        },
    ],
    "he-IL": [
        {
            VoiceName: "Microsoft Avri Online (Natural)",
            VoiceURI: "he-IL-AvriNeural",
        },
        {
            VoiceName: "Microsoft Hila Online (Natural)",
            VoiceURI: "he-IL-HilaNeural",
        },
    ],
    "hi-IN": [
        {
            VoiceName: "Microsoft Madhur Online (Natural)",
            VoiceURI: "hi-IN-MadhurNeural",
        },
        {
            VoiceName: "Microsoft Swara Online (Natural)",
            VoiceURI: "hi-IN-SwaraNeural",
        },
    ],
    "hu-HU": [
        {
            VoiceName: "Microsoft Noemi Online (Natural)",
            VoiceURI: "hu-HU-NoemiNeural",
        },
        {
            VoiceName: "Microsoft Tamas Online (Natural)",
            VoiceURI: "hu-HU-TamasNeural",
        },
    ],
    "is-IS": [
        {
            VoiceName: "Microsoft Gudrun Online (Natural)",
            VoiceURI: "is-IS-GudrunNeural",
        },
        {
            VoiceName: "Microsoft Gunnar Online (Natural)",
            VoiceURI: "is-IS-GunnarNeural",
        },
    ],
    "id-ID": [
        {
            VoiceName: "Microsoft Ardi Online (Natural)",
            VoiceURI: "id-ID-ArdiNeural",
        },
        {
            VoiceName: "Microsoft Gadis Online (Natural)",
            VoiceURI: "id-ID-GadisNeural",
        },
    ],
    "ga-IE": [
        {
            VoiceName: "Microsoft Colm Online (Natural)",
            VoiceURI: "ga-IE-ColmNeural",
        },
        {
            VoiceName: "Microsoft Orla Online (Natural)",
            VoiceURI: "ga-IE-OrlaNeural",
        },
    ],
    "it-IT": [
        {
            VoiceName: "Microsoft Diego Online (Natural)",
            VoiceURI: "it-IT-DiegoNeural",
        },
        {
            VoiceName: "Microsoft Elsa Online (Natural)",
            VoiceURI: "it-IT-ElsaNeural",
        },
        {
            VoiceName: "Microsoft Isabella Online (Natural)",
            VoiceURI: "it-IT-IsabellaNeural",
        },
    ],
    "ja-JP": [
        {
            VoiceName: "Microsoft Keita Online (Natural)",
            VoiceURI: "ja-JP-KeitaNeural",
        },
        {
            VoiceName: "Microsoft Nanami Online (Natural)",
            VoiceURI: "ja-JP-NanamiNeural",
        },
    ],
    "jv-ID": [
        {
            VoiceName: "Microsoft Dimas Online (Natural)",
            VoiceURI: "jv-ID-DimasNeural",
        },
        {
            VoiceName: "Microsoft Siti Online (Natural)",
            VoiceURI: "jv-ID-SitiNeural",
        },
    ],
    "kn-IN": [
        {
            VoiceName: "Microsoft Gagan Online (Natural)",
            VoiceURI: "kn-IN-GaganNeural",
        },
        {
            VoiceName: "Microsoft Sapna Online (Natural)",
            VoiceURI: "kn-IN-SapnaNeural",
        },
    ],
    "kk-KZ": [
        {
            VoiceName: "Microsoft Aigul Online (Natural)",
            VoiceURI: "kk-KZ-AigulNeural",
        },
        {
            VoiceName: "Microsoft Daulet Online (Natural)",
            VoiceURI: "kk-KZ-DauletNeural",
        },
    ],
    "km-KH": [
        {
            VoiceName: "Microsoft Piseth Online (Natural)",
            VoiceURI: "km-KH-PisethNeural",
        },
        {
            VoiceName: "Microsoft Sreymom Online (Natural)",
            VoiceURI: "km-KH-SreymomNeural",
        },
    ],
    "ko-KR": [
        {
            VoiceName: "Microsoft InJoon Online (Natural)",
            VoiceURI: "ko-KR-InJoonNeural",
        },
        {
            VoiceName: "Microsoft SunHi Online (Natural)",
            VoiceURI: "ko-KR-SunHiNeural",
        },
    ],
    "lo-LA": [
        {
            VoiceName: "Microsoft Chanthavong Online (Natural)",
            VoiceURI: "lo-LA-ChanthavongNeural",
        },
        {
            VoiceName: "Microsoft Keomany Online (Natural)",
            VoiceURI: "lo-LA-KeomanyNeural",
        },
    ],
    "lv-LV": [
        {
            VoiceName: "Microsoft Everita Online (Natural)",
            VoiceURI: "lv-LV-EveritaNeural",
        },
        {
            VoiceName: "Microsoft Nils Online (Natural)",
            VoiceURI: "lv-LV-NilsNeural",
        },
    ],
    "lt-LT": [
        {
            VoiceName: "Microsoft Leonas Online (Natural)",
            VoiceURI: "lt-LT-LeonasNeural",
        },
        {
            VoiceName: "Microsoft Ona Online (Natural)",
            VoiceURI: "lt-LT-OnaNeural",
        },
    ],
    "mk-MK": [
        {
            VoiceName: "Microsoft Aleksandar Online (Natural)",
            VoiceURI: "mk-MK-AleksandarNeural",
        },
        {
            VoiceName: "Microsoft Marija Online (Natural)",
            VoiceURI: "mk-MK-MarijaNeural",
        },
    ],
    "ms-MY": [
        {
            VoiceName: "Microsoft Osman Online (Natural)",
            VoiceURI: "ms-MY-OsmanNeural",
        },
        {
            VoiceName: "Microsoft Yasmin Online (Natural)",
            VoiceURI: "ms-MY-YasminNeural",
        },
    ],
    "ml-IN": [
        {
            VoiceName: "Microsoft Midhun Online (Natural)",
            VoiceURI: "ml-IN-MidhunNeural",
        },
        {
            VoiceName: "Microsoft Sobhana Online (Natural)",
            VoiceURI: "ml-IN-SobhanaNeural",
        },
    ],
    "mt-MT": [
        {
            VoiceName: "Microsoft Grace Online (Natural)",
            VoiceURI: "mt-MT-GraceNeural",
        },
        {
            VoiceName: "Microsoft Joseph Online (Natural)",
            VoiceURI: "mt-MT-JosephNeural",
        },
    ],
    "mr-IN": [
        {
            VoiceName: "Microsoft Aarohi Online (Natural)",
            VoiceURI: "mr-IN-AarohiNeural",
        },
        {
            VoiceName: "Microsoft Manohar Online (Natural)",
            VoiceURI: "mr-IN-ManoharNeural",
        },
    ],
    "mn-MN": [
        {
            VoiceName: "Microsoft Bataa Online (Natural)",
            VoiceURI: "mn-MN-BataaNeural",
        },
        {
            VoiceName: "Microsoft Yesui Online (Natural)",
            VoiceURI: "mn-MN-YesuiNeural",
        },
    ],
    "ne-NP": [
        {
            VoiceName: "Microsoft Hemkala Online (Natural)",
            VoiceURI: "ne-NP-HemkalaNeural",
        },
        {
            VoiceName: "Microsoft Sagar Online (Natural)",
            VoiceURI: "ne-NP-SagarNeural",
        },
    ],
    "nb-NO": [
        {
            VoiceName: "Microsoft Finn Online (Natural)",
            VoiceURI: "nb-NO-FinnNeural",
        },
        {
            VoiceName: "Microsoft Pernille Online (Natural)",
            VoiceURI: "nb-NO-PernilleNeural",
        },
    ],
    "ps-AF": [
        {
            VoiceName: "Microsoft GulNawaz Online (Natural)",
            VoiceURI: "ps-AF-GulNawazNeural",
        },
        {
            VoiceName: "Microsoft Latifa Online (Natural)",
            VoiceURI: "ps-AF-LatifaNeural",
        },
    ],
    "fa-IR": [
        {
            VoiceName: "Microsoft Dilara Online (Natural)",
            VoiceURI: "fa-IR-DilaraNeural",
        },
        {
            VoiceName: "Microsoft Farid Online (Natural)",
            VoiceURI: "fa-IR-FaridNeural",
        },
    ],
    "pl-PL": [
        {
            VoiceName: "Microsoft Marek Online (Natural)",
            VoiceURI: "pl-PL-MarekNeural",
        },
        {
            VoiceName: "Microsoft Zofia Online (Natural)",
            VoiceURI: "pl-PL-ZofiaNeural",
        },
    ],
    "pt-BR": [
        {
            VoiceName: "Microsoft Antonio Online (Natural)",
            VoiceURI: "pt-BR-AntonioNeural",
        },
        {
            VoiceName: "Microsoft Francisca Online (Natural)",
            VoiceURI: "pt-BR-FranciscaNeural",
        },
    ],
    "pt-PT": [
        {
            VoiceName: "Microsoft Duarte Online (Natural)",
            VoiceURI: "pt-PT-DuarteNeural",
        },
        {
            VoiceName: "Microsoft Raquel Online (Natural)",
            VoiceURI: "pt-PT-RaquelNeural",
        },
    ],
    "ro-RO": [
        {
            VoiceName: "Microsoft Alina Online (Natural)",
            VoiceURI: "ro-RO-AlinaNeural",
        },
        {
            VoiceName: "Microsoft Emil Online (Natural)",
            VoiceURI: "ro-RO-EmilNeural",
        },
    ],
    "ru-RU": [
        {
            VoiceName: "Microsoft Dmitry Online (Natural)",
            VoiceURI: "ru-RU-DmitryNeural",
        },
        {
            VoiceName: "Microsoft Svetlana Online (Natural)",
            VoiceURI: "ru-RU-SvetlanaNeural",
        },
    ],
    "sr-RS": [
        {
            VoiceName: "Microsoft Nicholas Online (Natural)",
            VoiceURI: "sr-RS-NicholasNeural",
        },
        {
            VoiceName: "Microsoft Sophie Online (Natural)",
            VoiceURI: "sr-RS-SophieNeural",
        },
    ],
    "si-LK": [
        {
            VoiceName: "Microsoft Sameera Online (Natural)",
            VoiceURI: "si-LK-SameeraNeural",
        },
        {
            VoiceName: "Microsoft Thilini Online (Natural)",
            VoiceURI: "si-LK-ThiliniNeural",
        },
    ],
    "sk-SK": [
        {
            VoiceName: "Microsoft Lukas Online (Natural)",
            VoiceURI: "sk-SK-LukasNeural",
        },
        {
            VoiceName: "Microsoft Viktoria Online (Natural)",
            VoiceURI: "sk-SK-ViktoriaNeural",
        },
    ],
    "sl-SI": [
        {
            VoiceName: "Microsoft Petra Online (Natural)",
            VoiceURI: "sl-SI-PetraNeural",
        },
        {
            VoiceName: "Microsoft Rok Online (Natural)",
            VoiceURI: "sl-SI-RokNeural",
        },
    ],
    "so-SO": [
        {
            VoiceName: "Microsoft Muuse Online (Natural)",
            VoiceURI: "so-SO-MuuseNeural",
        },
        {
            VoiceName: "Microsoft Ubax Online (Natural)",
            VoiceURI: "so-SO-UbaxNeural",
        },
    ],
    "es-AR": [
        {
            VoiceName: "Microsoft Elena Online (Natural)",
            VoiceURI: "es-AR-ElenaNeural",
        },
        {
            VoiceName: "Microsoft Tomas Online (Natural)",
            VoiceURI: "es-AR-TomasNeural",
        },
    ],
    "es-BO": [
        {
            VoiceName: "Microsoft Marcelo Online (Natural)",
            VoiceURI: "es-BO-MarceloNeural",
        },
        {
            VoiceName: "Microsoft Sofia Online (Natural)",
            VoiceURI: "es-BO-SofiaNeural",
        },
    ],
    "es-CL": [
        {
            VoiceName: "Microsoft Catalina Online (Natural)",
            VoiceURI: "es-CL-CatalinaNeural",
        },
        {
            VoiceName: "Microsoft Lorenzo Online (Natural)",
            VoiceURI: "es-CL-LorenzoNeural",
        },
    ],
    "es-CO": [
        {
            VoiceName: "Microsoft Gonzalo Online (Natural)",
            VoiceURI: "es-CO-GonzaloNeural",
        },
        {
            VoiceName: "Microsoft Salome Online (Natural)",
            VoiceURI: "es-CO-SalomeNeural",
        },
    ],
    "es-CR": [
        {
            VoiceName: "Microsoft Juan Online (Natural)",
            VoiceURI: "es-CR-JuanNeural",
        },
        {
            VoiceName: "Microsoft Maria Online (Natural)",
            VoiceURI: "es-CR-MariaNeural",
        },
    ],
    "es-CU": [
        {
            VoiceName: "Microsoft Belkys Online (Natural)",
            VoiceURI: "es-CU-BelkysNeural",
        },
        {
            VoiceName: "Microsoft Manuel Online (Natural)",
            VoiceURI: "es-CU-ManuelNeural",
        },
    ],
    "es-DO": [
        {
            VoiceName: "Microsoft Emilio Online (Natural)",
            VoiceURI: "es-DO-EmilioNeural",
        },
        {
            VoiceName: "Microsoft Ramona Online (Natural)",
            VoiceURI: "es-DO-RamonaNeural",
        },
    ],
    "es-EC": [
        {
            VoiceName: "Microsoft Andrea Online (Natural)",
            VoiceURI: "es-EC-AndreaNeural",
        },
        {
            VoiceName: "Microsoft Luis Online (Natural)",
            VoiceURI: "es-EC-LuisNeural",
        },
    ],
    "es-SV": [
        {
            VoiceName: "Microsoft Lorena Online (Natural)",
            VoiceURI: "es-SV-LorenaNeural",
        },
        {
            VoiceName: "Microsoft Rodrigo Online (Natural)",
            VoiceURI: "es-SV-RodrigoNeural",
        },
    ],
    "es-GQ": [
        {
            VoiceName: "Microsoft Javier Online (Natural)",
            VoiceURI: "es-GQ-JavierNeural",
        },
        {
            VoiceName: "Microsoft Teresa Online (Natural)",
            VoiceURI: "es-GQ-TeresaNeural",
        },
    ],
    "es-GT": [
        {
            VoiceName: "Microsoft Andres Online (Natural)",
            VoiceURI: "es-GT-AndresNeural",
        },
        {
            VoiceName: "Microsoft Marta Online (Natural)",
            VoiceURI: "es-GT-MartaNeural",
        },
    ],
    "es-HN": [
        {
            VoiceName: "Microsoft Carlos Online (Natural)",
            VoiceURI: "es-HN-CarlosNeural",
        },
        {
            VoiceName: "Microsoft Karla Online (Natural)",
            VoiceURI: "es-HN-KarlaNeural",
        },
    ],
    "es-MX": [
        {
            VoiceName: "Microsoft Dalia Online (Natural)",
            VoiceURI: "es-MX-DaliaNeural",
        },
        {
            VoiceName: "Microsoft Jorge Online (Natural)",
            VoiceURI: "es-MX-JorgeNeural",
        },
    ],
    "es-NI": [
        {
            VoiceName: "Microsoft Federico Online (Natural)",
            VoiceURI: "es-NI-FedericoNeural",
        },
        {
            VoiceName: "Microsoft Yolanda Online (Natural)",
            VoiceURI: "es-NI-YolandaNeural",
        },
    ],
    "es-PA": [
        {
            VoiceName: "Microsoft Margarita Online (Natural)",
            VoiceURI: "es-PA-MargaritaNeural",
        },
        {
            VoiceName: "Microsoft Roberto Online (Natural)",
            VoiceURI: "es-PA-RobertoNeural",
        },
    ],
    "es-PY": [
        {
            VoiceName: "Microsoft Mario Online (Natural)",
            VoiceURI: "es-PY-MarioNeural",
        },
        {
            VoiceName: "Microsoft Tania Online (Natural)",
            VoiceURI: "es-PY-TaniaNeural",
        },
    ],
    "es-PE": [
        {
            VoiceName: "Microsoft Alex Online (Natural)",
            VoiceURI: "es-PE-AlexNeural",
        },
        {
            VoiceName: "Microsoft Camila Online (Natural)",
            VoiceURI: "es-PE-CamilaNeural",
        },
    ],
    "es-PR": [
        {
            VoiceName: "Microsoft Karina Online (Natural)",
            VoiceURI: "es-PR-KarinaNeural",
        },
        {
            VoiceName: "Microsoft Victor Online (Natural)",
            VoiceURI: "es-PR-VictorNeural",
        },
    ],
    "es-ES": [
        {
            VoiceName: "Microsoft Alvaro Online (Natural)",
            VoiceURI: "es-ES-AlvaroNeural",
        },
        {
            VoiceName: "Microsoft Elvira Online (Natural)",
            VoiceURI: "es-ES-ElviraNeural",
        },
    ],
    "es-US": [
        {
            VoiceName: "Microsoft Alonso Online (Natural)",
            VoiceURI: "es-US-AlonsoNeural",
        },
        {
            VoiceName: "Microsoft Paloma Online (Natural)",
            VoiceURI: "es-US-PalomaNeural",
        },
    ],
    "es-UY": [
        {
            VoiceName: "Microsoft Mateo Online (Natural)",
            VoiceURI: "es-UY-MateoNeural",
        },
        {
            VoiceName: "Microsoft Valentina Online (Natural)",
            VoiceURI: "es-UY-ValentinaNeural",
        },
    ],
    "es-VE": [
        {
            VoiceName: "Microsoft Paola Online (Natural)",
            VoiceURI: "es-VE-PaolaNeural",
        },
        {
            VoiceName: "Microsoft Sebastian Online (Natural)",
            VoiceURI: "es-VE-SebastianNeural",
        },
    ],
    "su-ID": [
        {
            VoiceName: "Microsoft Jajang Online (Natural)",
            VoiceURI: "su-ID-JajangNeural",
        },
        {
            VoiceName: "Microsoft Tuti Online (Natural)",
            VoiceURI: "su-ID-TutiNeural",
        },
    ],
    "sw-KE": [
        {
            VoiceName: "Microsoft Rafiki Online (Natural)",
            VoiceURI: "sw-KE-RafikiNeural",
        },
        {
            VoiceName: "Microsoft Zuri Online (Natural)",
            VoiceURI: "sw-KE-ZuriNeural",
        },
    ],
    "sw-TZ": [
        {
            VoiceName: "Microsoft Daudi Online (Natural)",
            VoiceURI: "sw-TZ-DaudiNeural",
        },
        {
            VoiceName: "Microsoft Rehema Online (Natural)",
            VoiceURI: "sw-TZ-RehemaNeural",
        },
    ],
    "sv-SE": [
        {
            VoiceName: "Microsoft Mattias Online (Natural)",
            VoiceURI: "sv-SE-MattiasNeural",
        },
        {
            VoiceName: "Microsoft Sofie Online (Natural)",
            VoiceURI: "sv-SE-SofieNeural",
        },
    ],
    "ta-IN": [
        {
            VoiceName: "Microsoft Pallavi Online (Natural)",
            VoiceURI: "ta-IN-PallaviNeural",
        },
        {
            VoiceName: "Microsoft Valluvar Online (Natural)",
            VoiceURI: "ta-IN-ValluvarNeural",
        },
    ],
    "ta-MY": [
        {
            VoiceName: "Microsoft Kani Online (Natural)",
            VoiceURI: "ta-MY-KaniNeural",
        },
        {
            VoiceName: "Microsoft Surya Online (Natural)",
            VoiceURI: "ta-MY-SuryaNeural",
        },
    ],
    "ta-SG": [
        {
            VoiceName: "Microsoft Anbu Online (Natural)",
            VoiceURI: "ta-SG-AnbuNeural",
        },
        {
            VoiceName: "Microsoft Venba Online (Natural)",
            VoiceURI: "ta-SG-VenbaNeural",
        },
    ],
    "ta-LK": [
        {
            VoiceName: "Microsoft Kumar Online (Natural)",
            VoiceURI: "ta-LK-KumarNeural",
        },
        {
            VoiceName: "Microsoft Saranya Online (Natural)",
            VoiceURI: "ta-LK-SaranyaNeural",
        },
    ],
    "te-IN": [
        {
            VoiceName: "Microsoft Mohan Online (Natural)",
            VoiceURI: "te-IN-MohanNeural",
        },
        {
            VoiceName: "Microsoft Shruti Online (Natural)",
            VoiceURI: "te-IN-ShrutiNeural",
        },
    ],
    "th-TH": [
        {
            VoiceName: "Microsoft Niwat Online (Natural)",
            VoiceURI: "th-TH-NiwatNeural",
        },
        {
            VoiceName: "Microsoft Premwadee Online (Natural)",
            VoiceURI: "th-TH-PremwadeeNeural",
        },
    ],
    "tr-TR": [
        {
            VoiceName: "Microsoft Ahmet Online (Natural)",
            VoiceURI: "tr-TR-AhmetNeural",
        },
        {
            VoiceName: "Microsoft Emel Online (Natural)",
            VoiceURI: "tr-TR-EmelNeural",
        },
    ],
    "uk-UA": [
        {
            VoiceName: "Microsoft Ostap Online (Natural)",
            VoiceURI: "uk-UA-OstapNeural",
        },
        {
            VoiceName: "Microsoft Polina Online (Natural)",
            VoiceURI: "uk-UA-PolinaNeural",
        },
    ],
    "ur-IN": [
        {
            VoiceName: "Microsoft Gul Online (Natural)",
            VoiceURI: "ur-IN-GulNeural",
        },
        {
            VoiceName: "Microsoft Salman Online (Natural)",
            VoiceURI: "ur-IN-SalmanNeural",
        },
    ],
    "ur-PK": [
        {
            VoiceName: "Microsoft Asad Online (Natural)",
            VoiceURI: "ur-PK-AsadNeural",
        },
        {
            VoiceName: "Microsoft Uzma Online (Natural)",
            VoiceURI: "ur-PK-UzmaNeural",
        },
    ],
    "uz-UZ": [
        {
            VoiceName: "Microsoft Madina Online (Natural)",
            VoiceURI: "uz-UZ-MadinaNeural",
        },
        {
            VoiceName: "Microsoft Sardor Online (Natural)",
            VoiceURI: "uz-UZ-SardorNeural",
        },
    ],
    "vi-VN": [
        {
            VoiceName: "Microsoft HoaiMy Online (Natural)",
            VoiceURI: "vi-VN-HoaiMyNeural",
        },
        {
            VoiceName: "Microsoft NamMinh Online (Natural)",
            VoiceURI: "vi-VN-NamMinhNeural",
        },
    ],
    "cy-GB": [
        {
            VoiceName: "Microsoft Aled Online (Natural)",
            VoiceURI: "cy-GB-AledNeural",
        },
        {
            VoiceName: "Microsoft Nia Online (Natural)",
            VoiceURI: "cy-GB-NiaNeural",
        },
    ],
    "zu-ZA": [
        {
            VoiceName: "Microsoft Thando Online (Natural)",
            VoiceURI: "zu-ZA-ThandoNeural",
        },
        {
            VoiceName: "Microsoft Themba Online (Natural)",
            VoiceURI: "zu-ZA-ThembaNeural",
        },
    ],
};

class TextToSpeechPlugin extends obsidian.Plugin {
    onload() {         
        this.loadSettings(); // Load settings when the plugin is loaded
        this.addCommand({
            id: 'play-selected-text-to-speech',
            name: 'Play Selected Text to Speech',
            checkCallback: (checking) => {
                const selectedText = this.getSelectedText();
                if (selectedText) {
                    if (!checking) {
                        this.getAudioData(selectedText);
                    }
                    return true;
                }
                return false;
            }
        });
        this.addCommand({
            id: 'play-entire-file-to-speech-no-markdown',
            name: 'Play Entire File to Speech (No Markdown)',
            callback: () => {
                const editor = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView)?.editor;
                if (editor) {
                    const entireText = this.getEntireFileText(editor);
                    const textWithoutMarkdown = this.removeMarkdown(entireText);
                    this.getAudioData(textWithoutMarkdown);
                }
            }
        });
        this.addCommand({
            id: 'stop-text-to-speech',
            name: 'Stop Text to Speech',
            callback: () => {
                if (playing) {
                    playing.pause();
                }
            }
        });
        this.registerEvent(
            this.app.workspace.on('editor-menu', (menu, editor) => {
                const selectedText = this.getSelectedText();
                if (selectedText) {
                    menu.addItem((item) => {
                        item.setTitle('Play Selected Text to Speech')
                            .setIcon('microphone')
                            .onClick(() => this.getAudioData(selectedText));
                    });
                }

                menu.addItem((item) => {
                    item.setTitle('Play Entire File to Speech')
                        .setIcon('audio-file')
                        .onClick(() => {
                            const entireText = this.getEntireFileText(editor);
                            this.getAudioData(entireText);
                        });
                });
            })
        );
        this.addSettingTab(new TextToSpeechSettingsTab(this.app, this));

    }
    
    async loadSettings() {
        this.settings = { ...DEFAULT_SETTINGS, ...await this.loadData()};
    }

    // Save plugin settings
    async saveSettings() {
        await this.saveData(this.settings);
    }

    getSelectedText() {
        let selection = window.getSelection();
        return selection ? selection.toString() : "";
    }

    getEntireFileText(editor) {
        return editor.getValue();
    }

    removeMarkdown(text) {
        text = text.replace(/---[\s\S]*?---/g, "");
        text = text.replace(/<!--[\s\S]*?-->/g, "");
        const regex = /(\!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|\*\*|__|~~|`|# |\* |\+ |- |\> )/g;
        text = text.replace(regex, "");
        return text;
    }

    getAudioData(text) {
        if (audioCache[text]) {
            this.playAudio(audioCache[text]);
            return;
        }
    
        const url = 'https://corsproxy.io/?' + encodeURIComponent("https://cloudtts.com/api/get_audio");
        const headers = {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "application/json",
            "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
        };
        const data = {
            rate: this.settings.rate,
            volume: this.settings.volume,
            voice: this.settings.current_voice,
            with_speechmarks: false,
            recording: false,
            text: text
        };
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(responseData => {
            const audioData = responseData.data.audio;
            audioCache[text] = audioData;
            this.playAudio(audioData);
        })
        .catch(error => console.error('Error:', error));
    }

    playAudio(base64Audio) {
        if (playing === null) {
            playing = new Audio("data:audio/wav;base64," + base64Audio);
        }
        else {
            playing.pause();
            playing = new Audio("data:audio/wav;base64," + base64Audio);
        }
        playing.play().catch(e => console.error("Audio playback error:", e));
    }
}

class TextToSpeechSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        let {containerEl} = this;
        containerEl.style.display = 'flex';
        containerEl.style.flexDirection = 'column';
        containerEl.empty();
        containerEl.createEl('h2', {text: 'Text to Speech Settings'});
        containerEl.createEl('h3', {text: 'Voice'});
        const voiceSelect = containerEl.createEl('select', {id: 'voice-select'});
        const previewButton = containerEl.createEl('button', {text: 'Preview'});        
        previewButton.onclick = () => {
            const text = "This is a preview of the selected voice.";
            this.plugin.getAudioData(text);
        };
        Object.keys(VOICES).forEach(language => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = language;
            voiceSelect.appendChild(optgroup);
            VOICES[language].forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.VoiceURI;
                option.text = voice.VoiceName;
                optgroup.appendChild(option);
            });
        });
        
        voiceSelect.value = this.plugin.settings.current_voice;
        voiceSelect.onchange = () => {
            this.plugin.settings.current_voice = voiceSelect.value;
            this.plugin.saveSettings();
            audioCache = {};
        };
   
        const sliders = containerEl.createDiv('sliders');
        sliders.style.width = '100%';
        sliders.style.display = 'flex';
        sliders.style.flexDirection = 'column';
        sliders.style.alignItems = 'center';
        sliders.style.justifyContent = 'center';
        sliders.style.marginTop = '20px';
        sliders.style.marginBottom = '20px';
        sliders.style.padding = '20px';
        const rateLabel = sliders.createEl('label', {text: 'Rate: ' + this.plugin.settings.rate});
        const rateSlider = sliders.createEl('input', {type: 'range', min: 0.5, max: 2.0, step: 0.1, value: this.plugin.settings.rate});
        rateSlider.style.width = '100%';
        rateSlider.oninput = () => {
            rateLabel.innerText = 'Rate: ' + rateSlider.value;
            this.plugin.settings.rate = Math.max(0.5, 2 / 100 * rateSlider.value);
            this.plugin.saveSettings();
            audioCache = {};
        };
        
        const volumeLabel = sliders.createEl('label', {text: 'Volume: ' + this.plugin.settings.volume});
        const volumeSlider = sliders.createEl('input', {type: 'range', min: 0.0, max: 1.0, step: 0.1, value: this.plugin.settings.volume});
        volumeSlider.style.width = '100%';
        volumeSlider.oninput = () => {
            volumeLabel.innerText = 'Volume: ' + volumeSlider.value;
            this.plugin.settings.volume = Math.max(0.1, 1 / 100 * volumeSlider.value);
            this.plugin.saveSettings();
            audioCache = {};
        };
        
    }
}


module.exports = TextToSpeechPlugin;
