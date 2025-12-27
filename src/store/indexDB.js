export class IndexDB {
    constructor(database, version, tablename) {
        this.database = database;
        this.version = version;
        this.tablename = tablename;
        this.db = null;
    }

    async init(indexname) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.database, this.version);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains(this.tablename)) {
                    const objectStore = db.createObjectStore(this.tablename, { keyPath: 'id', autoIncrement: true });
                    
                    // 处理单个索引名或索引数组
                    if (Array.isArray(indexname)) {
                        indexname.forEach(index => {
                            objectStore.createIndex(index, index, { unique: false });
                        });
                    } else if (indexname) {
                        objectStore.createIndex(indexname, indexname, { unique: false });
                    }
                    
                    console.log("对象存储创建成功");
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log("数据库打开成功");
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error("数据库打开失败:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 添加数据
    async add(data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.tablename], 'readwrite');
            const store = transaction.objectStore(this.tablename);
            const request = store.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // 获取数据
    async get(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.tablename], 'readonly');
            const store = transaction.objectStore(this.tablename);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // 获取所有数据
    async getAll() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.tablename], 'readonly');
            const store = transaction.objectStore(this.tablename);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    //根据indexName 来拿值
async findOneByIndex(indexName, value) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("数据库未初始化，请先调用 init() 方法"));
                return;
            }

            const transaction = this.db.transaction([this.tablename], 'readonly');
            const store = transaction.objectStore(this.tablename);
            
            if (!store.indexNames.contains(indexName)) {
                reject(new Error(`索引 ${indexName} 不存在`));
                return;
            }

            const index = store.index(indexName);
            const request = index.get(value);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    //根据indexname 与value 进行范围查找
     async findByIndex(indexName, value) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("数据库未初始化，请先调用 init() 方法"));
                return;
            }

            const transaction = this.db.transaction([this.tablename], 'readonly');
            const store = transaction.objectStore(this.tablename);
            
            // 检查索引是否存在
            if (!store.indexNames.contains(indexName)) {
                reject(new Error(`索引 ${indexName} 不存在`));
                return;
            }

            const index = store.index(indexName);
            const request = index.getAll(value);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    // 更新数据
    async update(data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.tablename], 'readwrite');
            const store = transaction.objectStore(this.tablename);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // 删除数据
    async delete(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.tablename], 'readwrite');
            const store = transaction.objectStore(this.tablename);
            const request = store.delete(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // 关闭数据库连接
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}
 
    

