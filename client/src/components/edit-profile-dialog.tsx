import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";

interface EditProfileFormData {
  displayName: string;
  bio: string;
  photoURL?: string;
}

export function EditProfileDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EditProfileFormData>({
    displayName: auth.currentUser?.displayName || "",
    bio: "",
    photoURL: auth.currentUser?.photoURL
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match(/image\/(jpeg|png)/) || file.size > 2 * 1024 * 1024) {
      toast({
        title: "Invalid file",
        description: "Please select a PNG or JPG file under 2MB",
        variant: "destructive"
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    // Validate displayName and bio
    if (!formData.displayName.trim()) {
      toast({
        title: "Validation Error",
        description: "Display name is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.bio.length > 300) {
      toast({
        title: "Validation Error",
        description: "Bio must not exceed 300 characters",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);

      // Upload image if selected
      let photoURL = formData.photoURL;
      if (imageFile) {
        const storage = getStorage();
        const imageRef = ref(storage, `profilePictures/${auth.currentUser.uid}.jpg`);
        await uploadBytes(imageRef, imageFile);
        photoURL = await getDownloadURL(imageRef);
      }

      // Update Firestore document
      const db = getFirestore();
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        displayName: formData.displayName,
        bio: formData.bio,
        photoURL,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Update Firebase Auth profile
      await auth.currentUser.updateProfile({
        displayName: formData.displayName,
        photoURL
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              maxLength={50}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <div className="relative">
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                maxLength={300}
                disabled={isLoading}
                className="resize-none"
                rows={4}
              />
              <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {formData.bio.length}/300
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Picture</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <Input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                disabled={isLoading}
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}