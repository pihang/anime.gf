import { useState, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputArea } from "@/components/ui/input-area";
import { PencilSquareIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { CardData } from "@shared/types";
import { nativeImage } from "electron";

const formSchema = z.object({
  tags: z.string().min(0).max(200),
  name: z.string().min(0).max(200),
  description: z.string().min(0).max(200),
  greeting: z.string().min(0).max(200),
  message_example: z.string().min(0).max(200)
});

function CreationPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [characterName, setCharacterName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [exampleMessages, setExampleMessages] = useState("");
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const bannerInput = useRef<HTMLInputElement>(null);
  const profileInput = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      greeting: "",
      message_example: ""
    }
  });

  //TODO: Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // // Create CardData object
    // const cardData: CardData = {
    //   spec: "spec",
    //   spec_version: "spec_version",
    //   character: {
    //     name: values.name,
    //     description: values.description,
    //     greeting: values.greeting,
    //     msg_examples: values.message_example
    //   },
    //   world: {
    //     description: "description"
    //   },
    //   meta: {
    //     title: values.name,
    //     created_at: new Date().toISOString(),
    //     creator: {
    //       card: "card",
    //       character: "character",
    //       world: "world"
    //     },
    //     tagline: "tagline",
    //     tags: values.tags.split(",")
    //   }
    // };
    // // Save CardData to JSON
    // const json = JSON.stringify(cardData, null, 2);
    // const blob = new Blob([json], { type: "application/json" });
    // const file = new File([blob], `${values.name}.json`, { type: "application/json" });
    // await window.api.blob.post("scripts/blob/cards", file);
    // // Rename and save images
    // if (bannerImage) {
    //   const bannerFile = new File([bannerImage], "banner.png", { type: "image/png" });
    //   await window.api.blob.post(`${values.name}`, bannerFile);
    // }
    // if (profileImage) {
    //   const avatarFile = new File([profileImage], "avatar.png", { type: "image/png" });
    //   await window.api.blob.post(`${values.name}`, avatarFile);
    // }
  }

  const handleBannerClick = () => {
    if (bannerInput.current) {
      bannerInput.current.click();
    }
  };

  const handleProfileClick = () => {
    if (profileInput.current) {
      profileInput.current.click();
    }
  };

  const handleBannerChange = async (event) => {
    const file = event.target.files[0];
    const res = await window.api.blob.image.get(file.path);

    if (res.kind === "ok") {
      const dataUrl = res.value.toDataURL();
      setBannerImage(dataUrl);
    }
  };

  const handleProfileChange = async (event) => {
    const file = event.target.files[0];
    const res = await window.api.blob.image.get(file.path);

    if (res.kind === "ok") {
      const dataUrl = res.value.toDataURL();
      setProfileImage(dataUrl);
    }
  };

  return (
    <div className="scroll-primary flex w-full items-center justify-center overflow-y-auto rounded-lg bg-background">
      <div className="w-[46rem] rounded-lg bg-neutral-800">
        {/* Banner and profile picture */}
        <div className="relative rounded-lg">
          <div
            className="flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-br from-neutral-700 to-neutral-500"
            onClick={handleBannerClick}
          >
            {bannerImage ? (
              <img src={bannerImage ?? ""} alt="Profile" className="" />
            ) : (
              <PencilSquareIcon className="absolute h-12 w-12 text-neutral-300" />
            )}
            <div className="absolute  inset-0 bg-black opacity-0 transition-opacity duration-200 hover:opacity-30"></div>
            <input
              type="file"
              style={{ display: "none" }}
              ref={bannerInput}
              onChange={handleBannerChange}
              accept=".jpg,.jpeg,.png"
            />
          </div>
          <div
            className="absolute -bottom-12 left-4 flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neutral-700 to-neutral-600"
            onClick={handleProfileClick}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="" />
            ) : (
              <PencilSquareIcon className="absolute h-8 w-8 text-neutral-300" />
            )}
            <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-200 hover:opacity-30"></div>
            <input
              type="file"
              style={{ display: "none" }}
              ref={profileInput}
              onChange={handleProfileChange}
              accept=".jpg,.jpeg,.png"
            />
          </div>
        </div>
        {/* Character details container */}
        <div className="px-6 pb-6 pt-12">
          <div className="flex flex-col pt-8">
            {/* Character details form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Character Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="add character name"
                          className="border-neutral-700 focus-visible:ring-neutral-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="add comma separated list of tags"
                          className="scroll-tertiary border-neutral-700 focus-visible:ring-neutral-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Character Description</FormLabel>
                      <FormControl>
                        <InputArea
                          placeholder="add character description"
                          className="scroll-tertiary border-neutral-700 focus-visible:ring-neutral-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="greeting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Character Greeting</FormLabel>
                      <FormControl>
                        <InputArea
                          placeholder="add character greeting"
                          className="scroll-tertiary border-neutral-700 focus-visible:ring-neutral-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message_example"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Examples</FormLabel>
                      <FormControl>
                        <InputArea
                          placeholder="add message examples"
                          className="scroll-tertiary border-neutral-700 focus-visible:ring-neutral-400 "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <button
                    className="flex items-center space-x-2 rounded-md bg-neutral-700 px-4 py-2 transition-colors duration-200 hover:bg-neutral-600"
                    type="submit"
                  >
                    <UserPlusIcon className="size-5" />
                    <span className="font-medium text-neutral-200">Create</span>
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreationPage;