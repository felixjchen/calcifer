import ShareDB from "sharedb";

// Delete entire doc
const delete_doc_content = (doc: ShareDB.Doc) => {
  doc.fetch(() => {
    let { content } = doc.data;
    let op = [{ p: ["content", 0], sd: content }];
    try {
      doc.submitOp(op);
    } catch (e) {
      console.error(e.message);
    }
  });
};

const add_doc_content = (doc: ShareDB.Doc, content: string) => {
  doc.fetch(() => {
    let end = doc.data.content.length;
    let op = [{ p: ["content", end], si: content }];
    try {
      doc.submitOp(op);
    } catch (e) {
      console.error(e.message);
    }
  });
};

export const set_doc_content = async (
  doc: ShareDB.Doc,
  content: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      doc.fetch(() => {
        if (doc.data === undefined || doc.data.content === undefined) {
          // First time => Create doc
          doc.create({ content });
          resolve("Created");
        } else if (doc.data.content !== content) {
          // Desync => Rewrite doc
          delete_doc_content(doc);
          add_doc_content(doc, content);
          resolve("Recreated");
        } else {
          // All good
          resolve("Nothing");
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};
