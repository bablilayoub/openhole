class Openhole < Formula
  desc "Expose localhost to the internet with one command"
  homepage "https://openhole.dev"
  version "0.3.0"
  license "MIT"

  on_macos do
    on_intel do
      url "https://github.com/bablilayoub/openhole/releases/download/v#{version}/openhole-darwin-amd64"
      sha256 "e7d472da68788dda5c7935d251d94c569fa17456236707ca2b2069be539f604f"
    end
    on_arm do
      url "https://github.com/bablilayoub/openhole/releases/download/v#{version}/openhole-darwin-arm64"
      sha256 "397b5995daf4bac317ab41707e0b0dde570ce5ae1683548cb94b74ea593dfb24"
    end
  end

  on_linux do
    on_intel do
      url "https://github.com/bablilayoub/openhole/releases/download/v#{version}/openhole-linux-amd64"
      sha256 "abfd781cda100fde42dd1d1656fce53d4686a38bb1fca3b3ba9d6753b891100f"
    end
    on_arm do
      url "https://github.com/bablilayoub/openhole/releases/download/v#{version}/openhole-linux-arm64"
      sha256 "c160daddc1178cb4f6ed60a309c035ec5a4d29d8e1d822b5f41c9c1a66b95072"
    end
  end

  def install
    if OS.mac?
      arch = Hardware::CPU.arm? ? "arm64" : "amd64"
      bin.install "openhole-darwin-#{arch}" => "openhole"
    else
      arch = Hardware::CPU.arm? ? "arm64" : "amd64"
      bin.install "openhole-linux-#{arch}" => "openhole"
    end
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/openhole --version")
  end
end
