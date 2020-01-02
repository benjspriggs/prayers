/**
 * The hierarchy path, from root to leaf for this node.
 */
export type ResourcePath = string[];

/**
 * An individual reading.
 */
export interface Reading {
  content: {
    text: string;
    classes: string[];
  }[];
  authorId?: string;
  categoryIds: string[];
  digest: string;
  title?: string;
}

export interface Category {
  displayName: string;
  parent?: ResourcePath;
}

export interface Book {
  /**
   * All of the readings associated with this book.
   */
  readings: string[];

  title: string;
  subtitle?: string;

  /**
   * A digest of the book's content as a JSON object.
   */
  digest: string;
  authorId?: string;
}

export interface Author {
  displayName: string;
}
