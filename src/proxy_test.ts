import { assertEquals, describe, it } from "../test_deps.ts";
import { join } from "./proxy.ts";

describe("join", () => {
  it("left is foo", () => {
    assertEquals(join("foo", "bar"), "foo/bar");
    assertEquals(join("foo", "bar/"), "foo/bar/");
    assertEquals(join("foo", "/bar"), "foo/bar");
    assertEquals(join("foo", "/bar/"), "foo/bar/");
  });

  it("left is foo/", () => {
    assertEquals(join("foo/", "bar"), "foo/bar");
    assertEquals(join("foo/", "bar/"), "foo/bar/");
    assertEquals(join("foo/", "/bar/"), "foo/bar/");
  });

  it("left is /foo", () => {
    assertEquals(join("/foo", "bar"), "/foo/bar");
    assertEquals(join("/foo", "/bar"), "/foo/bar");
    assertEquals(join("/foo", "bar/"), "/foo/bar/");
    assertEquals(join("/foo", "/bar/"), "/foo/bar/");
  });

  it("left is /foo/", () => {
    assertEquals(join("/foo/", "bar"), "/foo/bar");
    assertEquals(join("/foo/", "/bar"), "/foo/bar");
    assertEquals(join("/foo/", "bar/"), "/foo/bar/");
    assertEquals(join("/foo/", "/bar/"), "/foo/bar/");

    assertEquals(join("/foo/", "bar/", "baz"), "/foo/bar/baz");
    assertEquals(join("/foo/", "/bar/", "baz"), "/foo/bar/baz");
  });
});
