// fileProcess.js v0.0.5

var fs = require('fs');
var path = require('path');


/**
 * Удаляет имя из пути файла
 * @param {string} filepath Путь к файлу
 * @return Путь к папке с файлом 
 */
function edpDelFileName( filepath ) {
    const parsing = path.parse( filepath );
    return path.resolve( parsing.dir );
}

/**
 * Удаляет разрешение пути у файла
 * @param {string} filepath Путь к файлу
 * @return Путь к файлу с удаленным разрешением
 */
function edpDelFileExt( filepath ) {
    const parsing = path.parse( filepath );
    const joining = parsing.dir!='' ? [parsing.dir, parsing.name] : [parsing.name];
    return joining.join( path.sep );
}

/**
 * Удаляет имя из пути файла
 * @param {string} filepath Путь к файлу
 * @return Имя файла 
 */
function edpGetFileName( filepath ) {
    const parsing = path.parse( filepath );
    return parsing.name;
}

/**
 * Удаляет имя из пути файла
 * @param {string} filepath Путь к файлу
 * @return Разрещение файла 
 */
function edpGetFileExt( filepath ) {
    const parsing = path.parse( filepath );
    return parsing.ext;
}

/**
 * Заменяет разрешение файла
 * @param {string} filepath Путь к файлу
 * @param {(string | '.')} from Разрешение которое нужно поменять. '.' - любое разрешение файла
 * @param {string} to Разрешение на которое меняем
 * @return Путь к файлу с измененным разрешением
 */
function edpChangeFileExt ( filepath, from, to ) {
    const parsing = path.parse( filepath );
    const ext = (parsing.ext===from || from==='.') ? to : parsing.ext;
    return path.resolve( parsing.dir, parsing.name ) + ext;
}

/**
 * Замена части пути к файлу
 * @param {string} filepath Путь к файлу
 * @param {string[]} fromSubpath Часть пути к файлу котый меняем
 * @param {string[]} fromSubpath Часть пкти к файлу НА который меняем
 * @return Путь к файлу с измененным подпутем
 */
function edpChangeSubPath ( filepath, fromSubpath, toSubpath ) {
    const fSubpath = fromSubpath.join( path.sep );
    const tSubpath = toSubpath.join( path.sep );

    return filepath.replace(fSubpath, tSubpath)
}

/**
 * Проверяет, существует ли путь
 * @param {string} filepath Путь к файлу
 * @param {Object} data Какая-то информация для передачи дальше
 * @returns {Promise} Возвращает Promise:
 * - Если путь есть, то resolve(data)
 * - Если пути нет, то reject(data)
 */
function isExist( filepath, data={} ) {
    return new Promise(( resolve, reject ) => {
        fs.access(filepath, fs.constants.F_OK, (err) => {
            if (err === null) { resolve(data) }
            else { reject(data) }
        })
    })
}

/**
 * Считываем файл(асинхронно)
 * @param {string} filepath Путь к файлу
 * @param {string} encoding Кодировка в которой записан файл
 * @returns {Promise} Возвращает Promise:
 * - Если прочитал, то resolve(data)
 * - Если ошибка чтения, то reject(err)
 */
function readFile( filepath, encoding='utf-8' ) { 
    return new Promise((resolve, reject) => {
        console.log( filepath )
        fs.readFile( filepath, encoding, (err, data) => {
            if (err) { reject(err) }
            else { resolve(data) }
        })
    })
}

/**
 * Считываем файл(синхронно)
 * @param {string} filepath Путь к файлу
 * @param {string} encoding Кодировка в которой записан файл
 * @returns {string} Строку с содержимым файла
 */
function readFileSync( filepath, encoding='utf-8' ) { 
    return fs.readFileSync( filepath, encoding);
}

/**
 * Считываем JSON в Object
 * @param {string} filepath Путь к файлу
 * @param {string} encoding Кодировка в которой записан файл
 * @returns {Promise} Возвращает Promise:
 * - Если прочитал, то resolve(json)
 * - Если ошибка чтения, то reject(err)
 */
function readJSON( filepath, encoding='utf-8' ) { 
    return readFile( filepath, encoding ).then((data) => {
        return JSON.parse(data.toString());
    })
}

/**
 * Записываем в файл(асинхронно)
 * @param {string} filepath Путь к файлу
 * @param {string} data Записываемый текст
 * @returns {Promise} Возвращает Promise:
 * - Если записал, то resolve(data)
 * - Если ошибка записи, то reject(err)
 */
function writeFile( filepath, data ) { 
    return new Promise((resolve, reject) => {
        fs.writeFile( filepath, data, err => {
            if (err) { reject(err) }
            else  { resolve( data ) }
        })
    })
}

/**
 * Записываем в файл(синхронно)
 * @param {string} filepath Путь к файлу
 * @param {string} data Записываемый текст
 * @returns {string} Строку с содержимым файла
 */
function writeFileSync( filepath, data ) { 
    fs.writeFileSync( filepath, data);
}

/**
 * Записываем Object в файл
 * @param {string} filepath Путь к файлу
 * @param {string} json Записываемый Object
 * @returns {Promise} Возвращает Promise:
 * - Если записал, то resolve(jsonData)
 * - Если ошибка записи, то reject(err)
 */
function writeJSON( filepath, json ) { 
    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify(json)
        fs.writeFile( filepath, jsonData, err => {
            if (err) { reject(err) }
            else { resolve( jsonData ) }
        })
    })
}

/**
 * Получаем список файлов
 * @param {string} filepath Путь к папке в из которой получаем список
 * @returns {Promise} Возвращает Promise:
 * - Если смог прочитать файлы, то resolve([ filename1, filename2, ... ])
 * - Если ошибка чтения дирректории, то reject(err)
 */
function getFileList( filepath ) {
    return new Promise(( resolve ) => {
        fs.readdir(filepath, { withFileTypes: true }, (err, data) => {
            if(err) { reject(err) }
            else { resolve(data) }
        })
    }).then(( dirList ) => {
        const res = []
        dirList.forEach( dir => {
            if ( dir.isFile() ) { res.push( dir.name ) }
        });
        return res;
    })
}

/**
 * Получаем список папок
 * @param {string} filepath Путь к папке в из которой получаем список
 * @returns {Promise} Возвращает Promise:
 * - Если смог прочитать файлы, то resolve([ dirname1, dirname2, ... ])
 * - Если ошибка чтения дирректории, то reject(err)
 */
function getFolderList( filepath ) {
    return new Promise(( resolve ) => {
        fs.readdir(filepath, { withFileTypes: true }, (err, data) => {
            if(err) { reject(err) }
            else { resolve(data) }
        })
    }).then(( dirList ) => {
        const res = []
        dirList.forEach( dir => {
            if ( dir.isDirectory() ) { res.push( dir.name ) }
        });
        return res;
    })
}

/**
 * @typedef DirList
 * @type {{
 *      dir: (string),
 *      path: (string),
 *      type: ('dit'|'file'),
 *      lastEdit?: (Date),
 *      files: (DirList[])
 * }}
 * @example
 *  [{
 *      dir: 'Nature Science',
 *      path: 'C:\\Users\\Cucumber\\Documents\\MyProjects\\2000.00-BaseInfo\\md\\Nature Science',
 *      lastEdit: 2023-03-05T01:45:34.218Z,
 *      type: 'dir',
 *      files: [ ... ]
 *  }]
 */

/**
 * Получаем список файлов и папок
 * @param {string} filepath Путь к папке в из которой получаем список
 * @param {Object} [options={}] Набор опций, определяющий поведение функции
 * @param {boolean} options.getLastEdit Если true - записываем дату последнего редактирования {@link DirList.lastEdit}
 * @param {boolean} options.recursive Если true - рекурсивно получаем всю структуру папки
 * @returns {(DirList[]|-1)} Посмотри {@link DirList} чтобы понять структуру. В случае ошибки, вернет -1
 */
function getDirListSync( filepath, options={} ) {
    const optionsDefault = { getLastEdit: false, recursive: true }
    options = { ...optionsDefault, ...options }
    const { getLastEdit, recursive } = options

    function getDirListSyncDecoratable( filepath, result=[] ) {
        fs.readdirSync(filepath).forEach((dir) => {
            const fullPath = path.resolve( filepath, dir );
            const dirStats = { dir, filepath: fullPath };
            const stats = fs.statSync( fullPath );
    
            if( getLastEdit ) {
                dirStats.lastEdit = stats.mtime;
            }
            if(stats.isDirectory()) {
                dirStats.type = 'dir';
                dirStats.files = [];
                result.push( dirStats );
            }
            if(stats.isFile()) {
                dirStats.type = 'file';
                result.push( dirStats );
            }
    
            if(stats.isDirectory() && recursive) { 
                return getDirListSyncDecoratable( fullPath, dirStats.files )
            }
        })
        return result;
    }

    try { return getDirListSyncDecoratable( filepath ); }
    catch { return -1; }
}

/**
 * @deprecated
 * @param {string} filepath 
 * @param {Object} options 
 * @returns 
 */
function getDirList( filepath, options) {
    const defaultOptions = { sync:true, recursive:false, getLastEdit: false }
    options = { ...defaultOptions, ...options }

    const {sync, recursive, getLastEdit} = options
    if (recursive && sync) { 
        return getDirListSync(filepath, getLastEdit ) 
    }

    if(!recursive && !sync) {
        return new Promise(( resolve ) => {
            fs.readdir(filepath, (err, data) => {
                if(err) { reject(err) }
                else { resolve(data) }
            })
        })
    }
}

module.exports = {
    // edp - EDite Path
    edpDelFileName,
    edpDelFileExt,
    edpChangeFileExt,
    edpChangeSubPath,
    edpGetFileName,
    edpGetFileExt,

    readFile,
    readFileSync,
    readJSON,
    writeFile,
    writeFileSync,
    writeJSON,
    isExist,
    getDirList,
    getDirListSync,
    getFileList,
    getFolderList,
}
