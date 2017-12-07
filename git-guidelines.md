Git Guidelines
==============

[Some Git rules](#some-git-rules)  
[Our Git workflow](#git-workflow)  
[Writing good commit messages](#writing-good-commit-messages)  

<a name="some-git-rules"></a>
### 1. Some Git rules
Please keep these rules in mind:
* Perform work in a feature branch.
    
    _Why:_
    >Because this way all work is done in isolation on a dedicated branch rather than the main branch. It allows you to submit multiple pull requests without confusion. You can iterate without polluting the master branch with potentially unstable, unfinished code. [read more...](https://www.atlassian.com/git/tutorials/comparing-workflows#feature-branch-workflow)
* Branch out from `development`
    
    _Why:_
    >This way, you can make sure that code in master will almost always build without problems, and can be mostly used directly for releases.

* Never push into `development` or `master` branch. Make a Pull Request.
    
    _Why:_
    > It enables easy peer-review and testing of the code, and creates a forum for discussing the proposed feature. It also makes it easier for team members to keep track of which features have been completed.

* Update your local `development` branch and either:  
  - i) merge it into your feature branch  
  
  or  
  - ii) do an interactive rebase, before pushing your feature and making a Pull Request.

  _Why:_
  > i) Merging will allow you to make sure that your code works correctly with code written by the rest of the team, and let you fix any conflicts before your code is reviewed.  
      
    > ii) Rebasing will merge in the requested branch (usually `development`) and apply the commits that you have made locally to the top of the history without creating a merge commit (assuming there were no conflicts). Resulting in a nice and clean history.  [read more ...](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)  
_**Please note** that this process is destructive, and should only be done if you understand the possible consequences!_

* Resolve potential conflicts while merging/rebasing and before making a Pull Request.
* Delete local and remote feature branches after merging.
    
    _Why:_
    > If not, you will clutter up your list of branches with dead branches. It ensures that you only ever merge the branch back into  `development` once. Feature branches should only exist while the work is still in progress.

* Before making a Pull Request, make sure your feature branch builds successfully and passes all tests (including code style checks).
    
    _Why:_
    > You are about to add your code to a stable branch. If your feature-branch tests fail, there is a high chance that your destination branch build will fail too. Additionally, you need to apply a code style check before making a Pull Request. It aids readability and reduces the chance of formatting fixes being mingled in with actual changes.

* Use [this](./.gitignore) `.gitignore` file.
    
    _Why:_
    > It already has a list of system files that should not be sent with your code into a remote repository. In addition, it excludes setting folders and files for most used editors, as well as most common dependency folders.

* Protect your `development` and `master` branch.
  
    _Why:_
    > It protects your production-ready branches from receiving unexpected and irreversible changes. read more... [Github](https://help.github.com/articles/about-protected-branches/) and [Bitbucket](https://confluence.atlassian.com/bitbucketserver/using-branch-permissions-776639807.html)

<a name="git-workflow"></a>
### 2. Git workflow

This guide assumes that you have git installed locally, and that you are using git from the command-line.  
  
To set up the project locally:

   _Clone with HTTPS:_
   ```
   git clone https://github.com/chingu-voyage3/geckos-16.git
   ```
   _Or clone with SSH:_
   ```
   git clone git@github.com:chingu-voyage3/geckos-16.git
   ```
   _Then change into the working directory:_
   ```
   cd geckos-16
   ```
For many reasons, some of them mentioned above, I suggest that we use the [Feature-branch-workflow](https://www.atlassian.com/git/tutorials/comparing-workflows#feature-branch-workflow) with some elements of [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows#gitflow-workflow) (naming and having a development branch). The main steps are as follows:

* Make sure that you are on the `development` branch, and that the branch is up to date with origin.
    ```
    git checkout development
    git pull
    ```
* Checkout a new feature/issue/etc branch.
    ```
    git checkout -b <branchname>
    ```
* Make changes, and stage the files you want to commit.
    ```
    git add <filename>
    ```
    Or, to add all files:
    ```
    git add -A
    ```
    _Why:_
    > `git commit -A` will stage _All_ (new, modified and deleted) files.
    
* Commit changes.
  - If your commit message is short:
    ```
    git commit -m "<Add brief commit message. <=50 characters>"
    ```
  - If you need to add more detail:
    ```
    git commit -a
    ```
    _Why:_
    > `git commit -a` will start an editor which lets you separate the subject from the body. (You may be automatically thrown into Vim to write your commit message. Once you're done, you can exit the editor by hitting ESC, then: `:wq`). Read more about writing commit messages in *section 3*.

* Sync with remote to get changes you’ve missed.
    ```
    git checkout development
    git pull
    ```
    
    _Why:_
    > This will give you a chance to deal with conflicts on your machine while merging or rebasing(later) rather than creating a Pull Request that contains conflicts.
    
* Update your feature branch with latest changes from development, by merge or interactive rebase (Read more about which you should choose in *section 1, Some Git rules*).
  - _Merge:_
    ```
    git checkout <branchname>
    git merge origin development
    ```
  - _Rebase:_
    ```
    git checkout <branchname>
    git rebase -i --autosquash development
    ```
    
    _Why:_
    > You can use --autosquash to squash all your commits to a single commit. Nobody wants many commits for a single feature in development branch. [read more...](https://robots.thoughtbot.com/autosquashing-git-commits)
    
* If you don’t have conflict skip this step. If you have conflicts, [resolve them](https://help.github.com/articles/resolving-a-merge-conflict-using-the-command-line/)  and continue rebase.
    ```
    git add <file1> <file2> ...
    git rebase --continue
    ```
* Push your branch. Rebase will change history, so you'll have to use `-f` to force changes into the remote branch. If someone else is working on your branch, use the less destructive `--force-with-lease`.
    ```
    git push -f
    ```
    
    _Why:_
    > When you do a rebase, you are changing the history on your feature branch. As a result, Git will reject normal `git push`. Instead, you'll need to use the -f or --force flag. [read more...](https://developer.atlassian.com/blog/2015/04/force-with-lease/)
    
    
* Make a Pull Request.
* Pull request will be accepted, merged and close by a reviewer.
* Remove your local feature branch if you're done.

  ```
  git branch -d <branchname>
  ```
  to remove all branches which are no longer on remote
  ```
  git fetch -p && for branch in `git branch -vv | grep ': gone]' | awk '{print $1}'`; do git branch -D $branch; done
  ```

<a name="writing-good-commit-messages"></a>
### 3. Writing good commit messages

Having a good guideline for creating commits, and sticking to it, makes working with Git and collaborating with others a lot easier. Here are some rules of thumb ([source](https://chris.beams.io/posts/git-commit/#seven-rules)):

 * Limit the subject line to 50 characters and wrap the body (if you need one) at 72 characters.

    _Why:_
    > Commits should be as fine-grained and focused as possible, it is not the place to be verbose. [read more...](https://medium.com/@preslavrachev/what-s-with-the-50-72-rule-8a906f61f09c).  
    72 characters fits well on an 80-column terminal, after `git log` has added some padding.

 * Capitalize the subject line.
 * Do not end the subject line with a period.
 * Use [imperative mood](https://en.wikipedia.org/wiki/Imperative_mood) in the subject line. A properly formed Git commit subject line should always be able to complete the following sentence: **"If applied, this commit will..."**.

    _Why:_
    > Rather than writing messages that say what a committer has done. It's better to consider these messages as the instructions for what is going to be done after the commit is applied on the repository. [read more...](https://news.ycombinator.com/item?id=2079612)

 * Separate the subject from the body with a newline between the two.

    _Why:_
    > Git is smart enough to distinguish the first line of your commit message as your summary. In fact, if you try git shortlog, instead of git log, you will see a long list of commit messages, consisting of the id of the commit, and the summary only.

 * Use the body to explain **what** and **why** as opposed to **how**.
 
    _Why:_
    > The _how_ can be seen in the diff. The _what_ and the _why_ give other coders a context for the changes.

---
Sources:
[wearehive/project-guidelines](https://github.com/wearehive/project-guidelines/blob/master/README.md#some-git-rules)
